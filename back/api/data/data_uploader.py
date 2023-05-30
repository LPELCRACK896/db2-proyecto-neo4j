from neo4j import GraphDatabase, basic_auth
from credentials import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, AURA_INSTANCEID, AURA_INSTANCENAME
import os
from dataclasses import dataclass
import pandas as pd
import c_styles as cs
class Neo4jService(object):
    def __init__(self):
        self._driver = GraphDatabase.driver(
            NEO4J_URI, 
            auth=basic_auth(NEO4J_USERNAME, NEO4J_PASSWORD)
        )

    def close(self):
        self._driver.close()
        
    def query(self, query, parameters=None):
        with self._driver.session() as session:
            return list(session.run(query, parameters))


@dataclass
class Relation:
    start_in: tuple
    end_in: tuple
    name: str

@dataclass
class EntityFile:
    type: str
    url: str
    labels: list
    types_dict: dict
    relation: Relation
    dataframe: pd.DataFrame
    localfile: str

class BankNeo4j():

    def __init__(self , service: Neo4jService) -> None:
        self.service: Neo4jService = service
    
    def clean(self, show_results = False):
        results = self.service.query("MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n, r")
        if show_results:
            for record in results:
                print(record)


    def seek_all(self, show_results = False):
        results = self.service.query("MATCH (n) RETURN n")
        if show_results:
            for record in results:
                print(record)

    def upload_csv(self, filename, labels, types_dict=None):
        url = filename
        labels_str = ":".join(labels)
        create_query = f"""
        LOAD CSV WITH HEADERS FROM '{url}' AS row
        CREATE (n:{labels_str} {{}})
        """

        if types_dict is not None:
            create_query += 'SET '
            for key, value in types_dict.items():
                if value == 'int':
                    create_query += f'n.{key} = toInteger(row.{key}), '
                elif value == 'float':
                    create_query += f'n.{key} = toFloat(row.{key}), '
                elif value == 'bool':
                    create_query += f'n.{key} = toBoolean(row.{key}), '
                elif value == 'date':
                    create_query += f'n.{key} = date(row.{key}), '
                elif value == 'point':
                    create_query += f'n.{key} = point({{latitude: toFloat(row.latitude), longitude: toFloat(row.longitude)}}), '
                elif value == 'datetime':
                    create_query += f'n.{key} = datetime(row.{key}), '
                else:  # default is string
                    create_query += f'n.{key} = row.{key}, '
            create_query = create_query[:-2]  # remove trailing comma and space
        else:
            create_query += 'SET n = row'
        print(create_query)
        self.service.query(create_query)


    def __fast_cast(self, variable, type):
        typo = {
            "string": "toString(",
            "int": "toInteger(",
            "bool": "toBoolean("
        }
        
        if type in typo:
            mytype = typo[type]
            return mytype+variable+")"
        return variable
    
    def upload_csv_relation(self, entity_file: EntityFile):
        url = entity_file.localfile
        relation: Relation = entity_file.relation
        types_dict = entity_file.types_dict
        dataframe = pd.read_csv(url)

        for _, row in dataframe.iterrows():
            row_start_id = self.__fast_cast(str(row[":START_ID"]), relation.start_in[2])
            row_end_id = self.__fast_cast(str(row[":END_ID"]), relation.end_in[2])

            create_query = f"""
            MATCH (start:{relation.start_in[0]} {{ {relation.start_in[1]}: {row_start_id}}}), (end: {relation.end_in[0]} {{{relation.end_in[1]}: {row_end_id}}})
            MERGE (start)-[r:{relation.name}]->(end)
            """
            # Setting properties based on their types
            if types_dict is not None:
                create_query += 'SET '
                for key, value in types_dict.items():
                    if value == 'int':
                        create_query += f'r.{key} = toInteger("{row[key]}"), '
                    elif value == 'float':
                        create_query += f'r.{key} = toFloat("{row[key]}"), '
                    elif value == 'bool':
                        create_query += f'r.{key} = toBoolean("{row[key]}"), '
                    elif value == 'date':
                        create_query += f'r.{key} = date("{row[key]}"), '
                    elif value == 'point':
                        create_query += f'r.{key} = point({{latitude: toFloat("{row[key]}"), longitude: toFloat("{row[key]}")}}), '
                    elif value == 'datetime':
                        create_query += f'r.{key} = datetime("{row[key]}"), '
                    else:  # default is string
                        create_query += f'r.{key} = "{row[key]}", '
                create_query = create_query[:-2]  # remove trailing comma and space
            print(cs.s_yellow(create_query))
            print(cs.s_magenta("============="))
            #self.service.query(create_query)

def filtr_columns(columns):
    return [c for c in columns if not(c==':START_ID' or c==":END_ID" or c==":TYPE")]

def build_types_dict(columns, special_types):
    types_dict = {}
    columns = filtr_columns(columns)
    for column in columns:
        if column in special_types:
            types_dict[column] = special_types[column]
        else:
            types_dict[column] = "string"
    return types_dict
if __name__ == "__main__":
    # Test
    neo  = BankNeo4j(Neo4jService())
    current_dir = os.path.dirname(os.path.realpath(__file__))
    base_url = "https://raw.githubusercontent.com/LPELCRACK896/db2-proyecto-neo4j/main/back/api/data"
    files = [
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/clients.csv", 
            labels = ["Client", "Person"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "clients.csv")).columns, {"dpi": "int", "nit": "int", "average_income_pm": "float"}),
            relation=None,
            dataframe=None,
            localfile=os.path.join(current_dir, "clients.csv")
            
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/accounts.csv", 
            labels = ["Account"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "accounts.csv")).columns, {"number": "int", "balance": "int", "create_date": "date", "closing_date": "date"}),
            relation=None,
            dataframe=None,
            localfile=os.path.join(current_dir, "accounts.csv")
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/persons.csv", 
            labels = ["Person"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "persons.csv")).columns, {"dpi": "int"}),
            relation=None,
            dataframe=None,
            localfile=os.path.join(current_dir, "persons.csv")
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/transfers.csv", 
            labels = ["Transfer"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "transfers.csv")).columns, {"amount": "float"}),
            relation=None,
            dataframe=None,
            localfile=os.path.join(current_dir, "transfers.csv")
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/withdrawals.csv", 
            labels = ["Withdrawal"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "withdrawals.csv")).columns, {"amount": "float", 'latitude': 'point','longitude': 'point'}),
            relation=None,
            dataframe=None,
            localfile=os.path.join(current_dir, "withdrawals.csv")
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/deposits.csv", 
            labels = ["Deposit"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "deposits.csv")).columns, {"amount": "float", 'latitude': 'point','longitude': 'point'}),
            relation=None,
            dataframe=None,
            localfile=os.path.join(current_dir, "deposits.csv")

            ),  
        EntityFile(
            type = "RELATION", 
            url = f"{base_url}/accounts_clients.csv", 
            labels = ["Owes"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "accounts_clients.csv")).columns,{"start_capital": "float", 'is_favourite': 'bool','create_date': 'date'}),
            relation=Relation(("Client", "dpi", "int"),("Account", "number", "int"), "Owes" ),
            dataframe= pd.read_csv(os.path.join(current_dir, "accounts_clients.csv")),
            localfile=os.path.join(current_dir, "accounts_clients.csv")
            ),       
            
    ]
    neo.clean()
    for f in files:
        if f.type == "NODE":
            neo.upload_csv(f.url, f.labels, f.types_dict)
        else:
            neo.upload_csv_relation(entity_file=f)
    neo.service.close()
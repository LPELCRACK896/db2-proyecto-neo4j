from neo4j import GraphDatabase, basic_auth
from credentials import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, AURA_INSTANCEID, AURA_INSTANCENAME
import os
from dataclasses import dataclass
import pandas as pd

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
class EntityFile:
    type: str
    url: str
    labels: list
    types_dict: dict
    additional_data: dict
    dataframe: pd.DataFrame

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

    def upload_csv_relation(self, url_file, types_dict=None):
        url = url_file
        create_query = f"""
        LOAD CSV WITH HEADERS FROM '{url}' AS row
        MATCH (start {{id: toString(row.`:START_ID`)}}), (end {{id: toString(row.`:END_ID`)}})
        MERGE (start)-[r:row.`:TYPE`]->(end)
        """
        # Setting properties based on their types
        if types_dict is not None:
            create_query += 'SET '
            for key, value in types_dict.items():
                if value == 'int':
                    create_query += f'r.{key} = toInteger(row.`{key}`), '
                elif value == 'float':
                    create_query += f'r.{key} = toFloat(row.`{key}`), '
                elif value == 'bool':
                    create_query += f'r.{key} = toBoolean(row.`{key}`), '
                elif value == 'date':
                    create_query += f'r.{key} = date(row.`{key}`), '
                elif value == 'point':
                    create_query += f'r.{key} = point({{latitude: toFloat(row.latitude), longitude: toFloat(row.longitude)}}), '
                elif value == 'datetime':
                    create_query += f'r.{key} = datetime(row.`{key}`), '
                else:  # default is string
                    create_query += f'r.{key} = row.`{key}`, '
            create_query = create_query[:-2]  # remove trailing comma and space
        else:
            create_query += 'SET r = row'
        create_query += f'\nREMOVE r.`:START_ID`, r.`:END_ID`, r.`:TYPE`'
        print(create_query)
        self.service.query(create_query)

    def upload_csv_relation(self, url_file, type_dict):
        pass

    def create_relations(self, dataframe: pd.DataFrame, addiontal_data: dict):
        # Create the subdataframe by selecting only the columns from the original dataframe
        for index, row in dataframe.iterrows():
            # Access row values by column name
            properties_val = dict(row[[col for col in row.index if not col.startswith(':')]])
            start_id_val = dict(row[[col for col in row.index if col.startswith(':START_ID')]])
            end_id_val = dict(row[[col for col in row.index if col.startswith(':END_ID')]])
            type_val = list(row[[col for col in row.index if col.startswith(':TYPE')]])[0]
            
            # Perform operations on row values
            print(f"Properties: {properties_val}")
            print(f"Start ID: {start_id_val}")
            print(f"End ID: {end_id_val}")
            print(f"Type: {type_val}")
            print()
        


def build_types_dict(columns, special_types):
    types_dict = {}
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
            additional_data=None,
            dataframe=None
            
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/accounts.csv", 
            labels = ["Account"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "accounts.csv")).columns, {"number": "int", "balance": "int", "create_date": "date", "closing_date": "date"}),
            additional_data=None,
            dataframe=None
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/persons.csv", 
            labels = ["Person"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "persons.csv")).columns, {"dpi": "int"}),
            additional_data=None,
            dataframe=None
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/transfers.csv", 
            labels = ["Transfer"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "transfers.csv")).columns, {"amount": "float"}),
            additional_data=None,
            dataframe=None
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/withdrawals.csv", 
            labels = ["Withdrawal"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "withdrawals.csv")).columns, {"amount": "float", 'latitude': 'point','longitude': 'point'}),
            additional_data=None,
            dataframe=None
            ),
        EntityFile(
            type = "NODE", 
            url = f"{base_url}/deposits.csv", 
            labels = ["Deposit"], 
            types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "deposits.csv")).columns, {"amount": "float", 'latitude': 'point','longitude': 'point'}),
            additional_data=None,
            dataframe=None

            ),  
        EntityFile(
            type = "RELATION", 
            url = f"{base_url}/accounts_clients.csv", 
            labels = ["Owes"], 
            types_dict = {"start_capital": "float", 'is_favourite': 'bool','create_date': 'date'},
            additional_data={"start": "Client", "start_property": "dpi", "end": "Account", "end_property": "number"},
            dataframe= pd.read_csv(os.path.join(current_dir, "accounts_clients.csv"))
            ),       
            
    ]
    neo.clean()
    for f in files:
        if f.type == "NODE":
            neo.upload_csv(f.url, f.labels, f.types_dict)
            pass
        else:
            
            #neo.create_relations(f.dataframe, addiontal_data = f.additional_data)
            pass
    neo.service.close()
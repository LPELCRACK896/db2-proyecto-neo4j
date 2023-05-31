from neo4j import GraphDatabase, basic_auth
from credentials import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, AURA_INSTANCEID, AURA_INSTANCENAME
import os
import pandas as pd
import c_styles as cs
from data_classes import *
from files import files
from datetime import datetime
import pytz

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
    
    def format_datetime(self, datetime_str):
        try:
            dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S.%f")
            return dt.isoformat()
        except ValueError:
            dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")  
            return dt.isoformat()      
        
    
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
            "string": "\"",
            "int": "toInteger(",
            "bool": "toBoolean("
        }
        
        if type in typo:
            mytype = typo[type]
            if type!="string":
                return mytype+variable+")"
            return mytype+variable+"\""
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
                        if key in row:
                             if not pd.isna(row[key]):
                                create_query += f'r.{key} = date("{row[key]}"), '
                    elif value == 'point':
                        create_query += f'r.{key} = point({{latitude: toFloat("{row[key]}"), longitude: toFloat("{row[key]}")}}), '
                    elif value == 'datetime':
                        if key in row:
                            if not pd.isna(row[key]):
                                create_query += f'r.{key} = datetime("{self.format_datetime(row[key])}"), '
                    else:  # default is string
                        create_query += f'r.{key} = "{row[key]}", '
                if create_query[-4:]=='SET ':
                    create_query = create_query[:-4] # Remove set in case no property added
                else:
                    create_query = create_query[:-2]  # remove trailing comma and space
                

            print(cs.s_yellow(create_query))
            print(cs.s_magenta("============="))
            res = self.service.query(create_query)
            try: 
                print(res)
            except:
                pass


if __name__ == "__main__":
    # Test
    neo  = BankNeo4j(Neo4jService())
    neo.clean()
    for f in files:
        if f.type == "NODE":
            neo.upload_csv(f.url, f.labels, f.types_dict)
        else:
            neo.upload_csv_relation(entity_file=f)
    neo.service.close()
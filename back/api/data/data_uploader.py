from neo4j import GraphDatabase, basic_auth
from credentials import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, AURA_INSTANCEID, AURA_INSTANCENAME
import os

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

    def load_nodes_from_csv(self, file_path, labels):
        # Build a string of labels
        label_str = ':'.join(labels)
        query = f"""
            LOAD CSV WITH HEADERS FROM 'file:///{file_path}' AS row
            CREATE (n:{label_str} {{}})
            SET n = row
        """
        self.service.query(query)
        print("Finish import")


if __name__ == "__main__":
    # Test
    neo  = BankNeo4j(Neo4jService())
    # neo.clean()
    # neo.seek_all(show_results=True)
    current_dir = os.path.dirname(os.path.realpath(__file__))
    # Clients
    clients_csv = os.path.join(current_dir, 'clients.csv')
    neo.load_nodes_from_csv(clients_csv, ['Client', 'Person'])
    neo.service.close()
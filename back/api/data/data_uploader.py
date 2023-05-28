from neo4j import GraphDatabase, basic_auth
from credentials import NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, AURA_INSTANCEID, AURA_INSTANCENAME

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



if __name__ == "__main__":
    # Test
    neo4j_service = Neo4jService()

    results = neo4j_service.query("MATCH (n) RETURN n")

    for record in results:
        print(record)

    neo4j_service.close()

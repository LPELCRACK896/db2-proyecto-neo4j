import pandas as pd
from data_classes import *
import os
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
    EntityFile(
        type = "RELATION", 
        url = f"{base_url}/account_deposits.csv", 
        labels = ["RECEIVED"], 
        types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "account_deposits.csv")).columns,{'date': 'datetime'}),
        relation=Relation(("Account", "number", "int"),("Deposit", "id", "string"), "RECEIVED" ),
        dataframe= pd.read_csv(os.path.join(current_dir, "account_deposits.csv")),
        localfile=os.path.join(current_dir, "account_deposits.csv")
    ),         
    EntityFile(
        type = "RELATION", 
        url = f"{base_url}/person_deposits.csv", 
        labels = ["MADE"], 
        types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "person_deposits.csv")).columns,{'date': 'datetime'}),
        relation=Relation(("Person", "dpi", "int"),("Deposit", "id", "string"), "MADE" ),
        dataframe= pd.read_csv(os.path.join(current_dir, "person_deposits.csv")),
        localfile=os.path.join(current_dir, "person_deposits.csv")
    ),    

    EntityFile(
        type = "RELATION", 
        url = f"{base_url}/account_transfers_made.csv", 
        labels = ["MADE"], 
        types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "account_transfers_made.csv")).columns,{'date': 'datetime'}),
        relation=Relation(("Account", "number", "int"),("Transfer", "id", "string"), "MADE" ),
        dataframe= pd.read_csv(os.path.join(current_dir, "account_transfers_made.csv")),
        localfile=os.path.join(current_dir, "account_transfers_made.csv")
    ),       

    EntityFile(
        type = "RELATION", 
        url = f"{base_url}/account_transfers_recieved.csv", 
        labels = ["RECIEVED"], 
        types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "account_transfers_recieved.csv")).columns,{'date': 'datetime'}),
        relation=Relation(("Person", "dpi", "int"),("Transfer", "id", "string"), "RECIEVED" ),
        dataframe= pd.read_csv(os.path.join(current_dir, "account_transfers_recieved.csv")),
        localfile=os.path.join(current_dir, "account_transfers_recieved.csv")
    ),       
    EntityFile(
        type = "RELATION", 
        url = f"{base_url}/account_withdrawals.csv", 
        labels = ["MADE"], 
        types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "account_withdrawals.csv")).columns,{'date': 'datetime'}),
        relation=Relation(("Account", "number", "int"),("Withdrawal", "id", "string"), "MADE" ),
        dataframe= pd.read_csv(os.path.join(current_dir, "account_withdrawals.csv")),
        localfile=os.path.join(current_dir, "account_withdrawals.csv")
    ),       

    EntityFile(
        type = "RELATION", 
        url = f"{base_url}/person_withdrawals.csv", 
        labels = ["RECIEVED"], 
        types_dict = build_types_dict(pd.read_csv(os.path.join(current_dir, "person_withdrawals.csv")).columns,{'date': 'datetime'}),
        relation=Relation(("Person", "dpi", "int"),("Withdrawal", "id", "string"), "RECIEVED" ),
        dataframe= pd.read_csv(os.path.join(current_dir, "person_withdrawals.csv")),
        localfile=os.path.join(current_dir, "person_withdrawals.csv")
    ),   
]

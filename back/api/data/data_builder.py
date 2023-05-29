from faker import Faker
import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta
import datetime as dt
import c_styles as cs


fake: Faker = Faker()

def __write_csv(df: pd.DataFrame, filename: str):
    current_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(current_dir, filename)
    
    df.to_csv(file_path)
    print(f"File {filename} written in {file_path}")

def __get_fake_names(num_rows):
    return [fake.name() for _ in range(num_rows)]

def __get_fake_birthdates(num_rows, minimum_age=18, maximum_age=100):
    return [fake.date_of_birth(minimum_age=minimum_age, maximum_age=maximum_age) for _ in range(num_rows)]

def __get_fake_addresses(num_rows):
    return [fake.address() for _ in range(num_rows)]

def __get_fake_emails(num_rows):
    return [fake.email() for _ in range(num_rows)]

def __get_fake_id(num_rows):
    return [fake.uuid4() for _ in range(num_rows)]

def __get_fake_phones(num_rows):
    return [fake.phone_number() for _ in range(num_rows)]

def __get_fake_ocupation(num_rows):
    return [fake.job() for _ in range(num_rows)]

def __get_numeration(num_rows, start = 1):
    return [i+start for i in range(num_rows)]

def create_persons(num_rows, dpi_start = 1, to_csv = False):
    df = pd.DataFrame({
        'name': __get_fake_names(num_rows),
        'dpi': __get_numeration(num_rows, dpi_start),
    })
    if to_csv:
        __write_csv(df, 'persons.csv')
    return df

def create_clients(num_rows = 100, dpi_start = 1, to_csv = False):
    df = pd.DataFrame({
        'name': __get_fake_names(num_rows),
        'nit': __get_numeration(num_rows),
        'dpi': __get_numeration(num_rows, dpi_start),
        'address': __get_fake_addresses(num_rows),
        'birthdate': __get_fake_birthdates(num_rows),
        'phone': __get_fake_phones(num_rows),
        'ocupation': __get_fake_ocupation(num_rows),
        'average_income_pm': [random.randint(100, 50000) for _ in range(num_rows)]
    })

    if to_csv:
        __write_csv(df, 'clients.csv')

    return df

def __random_pick(df1: pd.DataFrame, df2: pd.DataFrame):
    
    df_pick = np.random.choice([0, 1])
    
    if df_pick == 0 and not df1.empty:  
        random_index = np.random.choice(df1.index)
        return df_pick, random_index
    elif df_pick == 1 and not df2.empty:  
        random_index = np.random.choice(df2.index)
        return df_pick, random_index
    elif df1.empty and not df2.empty:  
        random_index = np.random.choice(df2.index)
        return 1, random_index
    elif not df1.empty and df2.empty:
        random_index = np.random.choice(df1.index)
        return 0, random_index
    else:
        return None, None  

def __create_single_account(client_row: pd.Series, from_date = None):
    account_types =  [
        "Checking Account",
        "Savings Account",
        "Money Market Account",
        "Certificate of Deposit (CD)",
        "Individual Retirement Account (IRA)",
        "Joint Account",
        "Student Account",
        "Business Account"
    ]

    account_states = ["active", "inactive", "closed"]
    create_date = fake.date_between(start_date=from_date) if from_date else fake.date_this_century()
    end_date = fake.date_between_dates(date_start=create_date, date_end=dt.date(2023, 12, 31)) if random.uniform(0, 1)<0.2 else None 
    account_number = fake.unique.random_number(digits=10)
    capital = round(fake.random.uniform(1000, 50000), 2)

    account_client = pd.Series({
        ":START_ID(Client dpi)": client_row["dpi"],
        ":END_ID(Account number)": account_number,
        ":TYPE": "Owes",
        "start_capital": capital, 
        "is_favourite": random.choice([True, False]),
        "create_date": create_date
    })

    account = pd.Series({
        'number': account_number,
        'balance': capital,  
        'account_type': random.choice(account_types),
        'state': random.choice(account_states),
        "create_date": create_date,
        'closing_date': end_date
    })

    return account, account_client

def __generate_random_location():
    latitude = random.uniform(-90, 90)
    longitude = random.uniform(-180, 180)
    return latitude, longitude

def create_accounts(client_df: pd.DataFrame, min_accounts_per_client: int = 1, max_accounts_per_client: int= 3, to_csv = False, allow_logs = False):

    accounts = []
    accounts_clients = []
    if allow_logs:
        print(cs.s_magenta("=========ACCOUNTS CREATION LOG========="))
    for _, client in client_df.iterrows():
        num_accounts = fake.random_int(min_accounts_per_client, max_accounts_per_client)  # each client can have between 1 and 3 accounts
        start_date  = fake.date_between(start_date=dt.date(2010, 1, 1), end_date=datetime.now() - timedelta(days=1))
        for _ in range(num_accounts):
            account, accounts_client = __create_single_account(client, from_date=start_date)
            accounts.append(account)
            accounts_clients.append(accounts_client)
            start_date = accounts_client["create_date"]
            if allow_logs:
                client_name = client["name"]
                account_num = account["number"]
                print(cs.s_green(f"Cuenta creada para: {client_name}: {account_num}"))

    
    df_accounts = pd.DataFrame(accounts)
    df_accounts_clients = pd.DataFrame(accounts_clients)
    if to_csv:
        __write_csv(df_accounts, 'accounts.csv')
        __write_csv(df_accounts_clients, "accounts_clients.csv")

    return df_accounts, df_accounts_clients

def __create_single_withdrawal(account_row: pd.Series, person_row, type = "Client/Person", allow_log = False):

    if type not in ["Client/Person", "Person"]:
        print("Not allowed")
        return 

    withdrawal_types = ["ATM", "Bank"]
    withdrawal_states = ["completed", "failed", "pending"]
    withdrawal_motive = ["payment", "personal expense", "investment", "other"]
    create_date = fake.date_between_dates(date_start=account_row['create_date'], date_end=dt.date.today() if account_row['closing_date'] is None else account_row['closing_date'])
    balance = account_row['balance']
    w_id = fake.uuid4()

    amount = round(fake.random.uniform(1, balance+10), 2)
    state = random.choice(["completed", "pending", "completed"])
    latitude, longitude = __generate_random_location() 
    
    if amount>balance:
        state = "failed"

    withdrawal = pd.Series({
        'id': w_id,
        'state': state,
        'motive': random.choice(withdrawal_motive),
        'type': random.choice(withdrawal_types),
        'amount': amount,  
        "location": {
            "latitude": latitude, 
            "longitude": longitude
        }
    })
    if allow_log:
        if state == "pending":
            print(cs.s_yellow(f"PENDIND withdrawal ({w_id}): ${amount} from {balance} in ({latitude}, {longitude})"))
        elif state == "failed":
            print(cs.s_red(f"FAILED withdrawal ({w_id}): ${amount} from {balance} in ({latitude}, {longitude})"))
        else: # completed
            print(cs.s_green(f"COMPLETED withdrawal ({w_id}): ${amount} from {balance} in ({latitude}, {longitude})"))

    account_withdrawal = pd.Series({
        ":START_ID(Account number)": person_row["dpi"],
        ":END_ID(Withdrawal id)": w_id,
        ":TYPE": "MADE",
        'date': create_date

    })

    person_withdrawal = pd.Series({
        ":START_ID(Person dpi)": person_row["dpi"],
        ":END_ID(Withdrawal id)": w_id,
        ":TYPE": "RECIEVED",
        'date': create_date if state=="completed" else None,

    })


    if state == "completed":
        account_row["balance"] = balance - amount

    return withdrawal, account_withdrawal, person_withdrawal, account_row

def create_withdrawals(accounts_df: pd.DataFrame, clients_df: pd.DataFrame, persons_df: pd.DataFrame, min_withdrawals_per_account:int = 1, max_withdrawals_per_account:int = 5, to_csv:bool = False, allow_logs = False):
    withdrawals = []
    account_withdrawals = []
    person_withdrawals = []
    dataframes = [clients_df, persons_df]
    if allow_logs:
        print(cs.s_magenta("=========WITHDRAWALS CREATION LOG========="))
    for i, account in accounts_df.iterrows():
        num_withdrawals = fake.random_int(min_withdrawals_per_account, max_withdrawals_per_account)  # each account can have between 1 and 5 withdrawals

        for _ in range(num_withdrawals):

            index_df_picked, row_index_selected = __random_pick(dataframes[0], dataframes[1])
            dataframe: pd.DataFrame = dataframes[index_df_picked]
            row = dataframe.iloc[row_index_selected] 
            withdrawal, account_withdrawal, person_withdrawal, acc_row = __create_single_withdrawal(account_row = account, person_row = row, type= "Client/Person" if index_df_picked==0 else "Person", allow_log=allow_logs)
            
            withdrawals.append(withdrawal)
            account_withdrawals.append(account_withdrawal)
            person_withdrawals.append(person_withdrawal)
            
            accounts_df.iloc[i] = acc_row


    df_withdrawals = pd.DataFrame(withdrawals)
    df_account_withdrawals = pd.DataFrame(account_withdrawals)
    df_person_withdrawals = pd.DataFrame(person_withdrawals)

    if to_csv:
        __write_csv(df_withdrawals, 'withdrawals.csv')
        __write_csv(df_person_withdrawals, "person_withdrawals.csv")
        __write_csv(df_account_withdrawals, "account_withdrawals.csv")
        __write_csv(accounts_df, "accounts.csv")


    return df_withdrawals, df_person_withdrawals, df_account_withdrawals, accounts_df 

def __create_single_transfer(account_row: pd.Series, all_account_numbers):
    transfer_states = ["completed", "failed", "pending"]
    transfer_motive = ["payment", "personal expense", "investment", "other"]
    create_date = fake.date_between_dates(date_start=account_row['create_date'], date_end=dt.date.today() if account_row['end_date'] is None else account_row['end_date'])
    
    transfer = pd.Series({
        'id': fake.uuid4(),
        'state': random.choice(transfer_states),
        'motive': random.choice(transfer_motive),
        'amount': round(fake.random.uniform(1, account_row['balance']), 2),  
        'destiny': random.choice([acc for acc in all_account_numbers if acc != account_row['number']]),  # select a different account as destiny
        'account_id': account_row['number']
    })
    
    return transfer

def create_transfers(accounts_df, min_transfers_per_account = 1, max_transfers_per_account = 3, to_csv = False):
    transfers = []
    all_account_numbers = accounts_df['number'].tolist()
    for _, account in accounts_df.iterrows():
        num_transfers = fake.random_int(min_transfers_per_account, max_transfers_per_account)  # each account can have between 1 and 3 transfers
        for _ in range(num_transfers):
            transfer = __create_single_transfer(account, all_account_numbers)
            transfers.append(transfer)
    
    df = pd.DataFrame(transfers)

    if to_csv:
        __write_csv(df, 'transfers.csv')

    return df

def __create_single_deposit(account_row: pd.Series):
    deposit_states = ["completed", "failed", "pending"] 
    deposit_motive = ["salary", "loan", "gift", "investment return", "other"]
    create_date = fake.date_between_dates(date_start=account_row['create_date'], date_end=dt.date.today() if account_row['end_date'] is None else account_row['end_date'])
    
    deposit = pd.Series({
        'id': fake.uuid4(),
        'state': random.choice(deposit_states),
        'motive': random.choice(deposit_motive),
        'date': create_date,
        'amount': round(fake.random.uniform(1, 10000), 2),  
        'account_id': account_row['number']
    })
    
    return deposit

def create_deposits(accounts_df, min_deposits_per_account = 1, max_deposits_per_account = 5, to_csv = False):
    deposits = []
    for _, account in accounts_df.iterrows():
        num_deposits = fake.random_int(min_deposits_per_account, max_deposits_per_account)  # each account can have between 1 and 5 deposits
        for _ in range(num_deposits):
            deposit = __create_single_deposit(account)
            deposits.append(deposit)
    
    df = pd.DataFrame(deposits)

    if to_csv:
        __write_csv(df, 'deposits.csv')

    return df

if __name__ == "__main__":
    clients_count = 100
    clients = create_clients(num_rows=clients_count, dpi_start=1,to_csv = True)
    persons = create_persons(num_rows=100, dpi_start = clients_count+1,to_csv = True)
    accounts, accounts_clients = create_accounts(client_df=clients, allow_logs=True, to_csv=True)
    create_withdrawals(accounts_df=accounts, clients_df=clients, persons_df=persons, to_csv=True, allow_logs=True)

    """     accounts = create_accounts(client_df=clients, to_csv=True)
    withdrawals = create_withdrawals(accounts_df=accounts, to_csv=True)
    transfers = create_transfers(accounts_df=accounts, to_csv=True)
    deposits = create_deposits(accounts_df=accounts, to_csv=True)
     """
    
    print("Clients")
    print(clients.head())
    print("Accounts")
"""     print(accounts.head())
    print("Withdrawals")
    print(withdrawals.head())
    print("Transfers")
    print(transfers.head())
    print("Deposits")
    print(deposits.head()) """
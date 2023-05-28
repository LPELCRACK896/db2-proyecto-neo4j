from faker import Faker
import pandas as pd
import os
import random
import datetime

fake = Faker()

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

def create_clients(num_rows = 100, to_csv = False):
    df = pd.DataFrame({
        'id': __get_fake_id(num_rows),
        'name': __get_fake_names(num_rows),
        'address': __get_fake_addresses(num_rows),
        'birthdate': __get_fake_birthdates(num_rows),
        'phone': __get_fake_phones(num_rows)
    })

    if to_csv:
        __write_csv(df, 'clients.csv')

    return df

def __create_single_account(client_row: pd.Series):
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
    create_date = fake.date_this_century()
    end_date = fake.date_between_dates(date_start=create_date, date_end=datetime.date(2100, 12, 31)) if random.uniform(0, 1)<0.2 else None 

    account = pd.Series({
        'client_id': client_row['id'],
        'account_number': fake.unique.random_number(digits=10),
        'balance': round(fake.random.uniform(1000, 50000), 2),  
        'account_type': random.choice(account_types),
        'account_state': random.choice(account_states),
        'create_date': create_date,
        'end_date': end_date
    })

    return account

def create_accounts(client_df, min_accounts_per_client = 1, max_accounts_per_client = 3, to_csv = False):
    accounts = []
    for _, client in client_df.iterrows():
        num_accounts = fake.random_int(min_accounts_per_client, max_accounts_per_client)  # each client can have between 1 and 3 accounts
        for _ in range(num_accounts):
            account = __create_single_account(client)
            accounts.append(account)
    
    df = pd.DataFrame(accounts)

    if to_csv:
        __write_csv(df, 'accounts.csv')

    return df

def __create_single_withdrawal(account_row: pd.Series):
    withdrawal_types = ["ATM", "Bank"]
    withdrawal_states = ["completed", "failed", "pending"]
    withdrawal_motive = ["payment", "personal expense", "investment", "other"]
    create_date = fake.date_between_dates(date_start=account_row['create_date'], date_end=datetime.date.today() if account_row['end_date'] is None else account_row['end_date'])
    
    withdrawal = pd.Series({
        'id': fake.uuid4(),
        'state': random.choice(withdrawal_states),
        'motive': random.choice(withdrawal_motive),
        'type': random.choice(withdrawal_types),
        'date': create_date,
        'amount': round(fake.random.uniform(1, account_row['balance']), 2),  
        'account_id': account_row['account_number']
    })
    
    return withdrawal

def create_withdrawals(account_df, min_withdrawals_per_account = 1, max_withdrawals_per_account = 5, to_csv = False):
    withdrawals = []
    for _, account in account_df.iterrows():
        num_withdrawals = fake.random_int(min_withdrawals_per_account, max_withdrawals_per_account)  # each account can have between 1 and 5 withdrawals
        for _ in range(num_withdrawals):
            withdrawal = __create_single_withdrawal(account)
            withdrawals.append(withdrawal)
    
    df = pd.DataFrame(withdrawals)

    if to_csv:
        __write_csv(df, 'withdrawals.csv')

    return df

def __create_single_transfer(account_row: pd.Series, all_account_numbers):
    transfer_states = ["completed", "failed", "pending"]
    transfer_motive = ["payment", "personal expense", "investment", "other"]
    create_date = fake.date_between_dates(date_start=account_row['create_date'], date_end=datetime.date.today() if account_row['end_date'] is None else account_row['end_date'])
    
    transfer = pd.Series({
        'id': fake.uuid4(),
        'state': random.choice(transfer_states),
        'motive': random.choice(transfer_motive),
        'amount': round(fake.random.uniform(1, account_row['balance']), 2),  
        'destiny': random.choice([acc for acc in all_account_numbers if acc != account_row['account_number']]),  # select a different account as destiny
        'account_id': account_row['account_number']
    })
    
    return transfer

def create_transfers(account_df, min_transfers_per_account = 1, max_transfers_per_account = 3, to_csv = False):
    transfers = []
    all_account_numbers = account_df['account_number'].tolist()
    for _, account in account_df.iterrows():
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
    create_date = fake.date_between_dates(date_start=account_row['create_date'], date_end=datetime.date.today() if account_row['end_date'] is None else account_row['end_date'])
    
    deposit = pd.Series({
        'id': fake.uuid4(),
        'state': random.choice(deposit_states),
        'motive': random.choice(deposit_motive),
        'date': create_date,
        'amount': round(fake.random.uniform(1, 10000), 2),  
        'account_id': account_row['account_number']
    })
    
    return deposit

def create_deposits(account_df, min_deposits_per_account = 1, max_deposits_per_account = 5, to_csv = False):
    deposits = []
    for _, account in account_df.iterrows():
        num_deposits = fake.random_int(min_deposits_per_account, max_deposits_per_account)  # each account can have between 1 and 5 deposits
        for _ in range(num_deposits):
            deposit = __create_single_deposit(account)
            deposits.append(deposit)
    
    df = pd.DataFrame(deposits)

    if to_csv:
        __write_csv(df, 'deposits.csv')

    return df

if __name__ == "__main__":
    clients = create_clients(100, True)
    accounts = create_accounts(client_df=clients, to_csv=True)
    withdrawals = create_withdrawals(account_df=accounts, to_csv=True)
    transfers = create_transfers(account_df=accounts, to_csv=True)
    deposits = create_deposits(account_df=accounts, to_csv=True)
    
    print("Clients")
    print(clients.head())
    print("Accounts")
    print(accounts.head())
    print("Withdrawals")
    print(withdrawals.head())
    print("Transfers")
    print(transfers.head())
    print("Deposits")
    print(deposits.head())



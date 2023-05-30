from data_builder import *


def main():
    clients_count = 20
    person_count  = 20
    clients = create_clients(num_rows=clients_count, dpi_start=1,to_csv = True)
    persons = create_persons(num_rows=person_count, dpi_start = clients_count+1,to_csv = True)
    accounts, accounts_clients = create_accounts(client_df=clients, persons_df=persons,  allow_logs=True, to_csv=True)
    withdrawals, person_withdrawals, account_withdrawals, accounts = create_withdrawals(accounts_df=accounts, clients_df=clients, persons_df=persons, to_csv=True, allow_logs=True)
    transfers, account_transfers_made, account_transfers_recieved = create_transfers(accounts_df = accounts, to_csv = True)
    deposits, person_deposits, account_deposits, accounts = create_deposits(accounts_df=accounts, clients_df=clients, persons_df=persons, to_csv=True, allow_logs=True)
    
    print("Clients")
    print(clients.head())
    print("Persons")
    print(persons.head())
    print("Accounts")
    print(accounts.head())
    print("Withdrawals")
    print(withdrawals.head())
    print("Transfers")
    print(transfers.head())
    print("Deposits")
    print(deposits.head())


if __name__ == "__main__":
    main()
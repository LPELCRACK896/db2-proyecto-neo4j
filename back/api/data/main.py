from data_builder import *


def main():
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

if __name__ == "__main__":
    main()
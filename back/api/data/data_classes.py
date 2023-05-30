from dataclasses import dataclass
import pandas as pd

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
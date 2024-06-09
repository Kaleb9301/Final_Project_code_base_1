from csv import reader
from datetime import datetime

def process_csv(file_name):
    file_content = []

    key_transformer = {
        "Date": "date",
        "MinT": "min_temprature",
        "MaxT": "max_temprature",
        "Rain": "rain",
        "RH1": "relative_humidity_1",
        "RH2": "relative_humidity_2",
        "Wind": "wind",
        "Evap": "evaporation",
        "Radiation": "radiation",
        "Cum_Rain": "cumilative_rain"
    }

    ignore_idx = [0, 8, 11, 12, 13]

    with open(file_name, 'r') as f:
        read = reader(f)
        headers = next(read)

        for header in headers:
            if header in key_transformer:
                headers[headers.index(header)] = key_transformer[header]

        for row in read:
            row_dict = {}
            for i, value in enumerate(row):
                if i in ignore_idx:
                    continue
                if i == 1:
                    row_dict[headers[i]] = datetime.strptime(value, '%m/%d/%Y').date()
                else:
                    row_dict[headers[i]] = float(value)
            file_content.append(row_dict)

    return file_content
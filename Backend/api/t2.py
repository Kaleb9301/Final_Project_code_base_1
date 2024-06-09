import pandas as pd
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import norm
import os
from api.models import WeatherData as WD
from api.models import Region

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
BASE_DIR = BASE_DIR + '/api'
model_path = os.path.join(BASE_DIR, 'drought_prediction_model.keras')
model = load_model(model_path)

csv_path = os.path.join(BASE_DIR, 'daily_statistics.csv')
daily_stats = pd.read_csv(csv_path)



def transform_list_to_dict(data):
    return {
            "min_temprature": data[0],
            "max_temprature": data[1],
            "rain": data[5],
            "rh1": data[2],
            "rh2": data[3],
            "wind": data[4],
            "evaporation": data[6],
            "radiation": data[7],
            "cum_rain": data[10]
        }

def calculate_spei_one_day(day_of_year, precipitation, evaporation, stats):
    ref_precip_mean = stats.loc[stats['DayOfYear'] == day_of_year, 'Precip_Mean'].values[0]
    ref_precip_std = stats.loc[stats['DayOfYear'] == day_of_year, 'Precip_Std'].values[0]
    ref_evap_mean = stats.loc[stats['DayOfYear'] == day_of_year, 'Evap_Mean'].values[0]
    ref_evap_std = stats.loc[stats['DayOfYear'] == day_of_year, 'Evap_Std'].values[0]
    precip_anomaly = (precipitation - ref_precip_mean) / ref_precip_std
    evap_anomaly = (evaporation - ref_evap_mean) / ref_evap_std
    D_anomaly = precip_anomaly - evap_anomaly
    spei_value = norm.ppf(norm.cdf(D_anomaly))
    return spei_value

def fetch_weather_data(region):
    r = Region.objects.get(pk=region)
    weather_data = WD.objects.filter(region=r)
    data = []
    for record in weather_data:
        data.append([
            record.date,
            record.max_temprature,
            record.min_temprature,
            record.relative_humidity_1,
            record.relative_humidity_2,
            record.wind,
            record.rain,
            record.evaporation,
            record.radiation,
            9.145,
            40.4897,
            record.cumilative_rain
        ])
    df = pd.DataFrame(data, columns=['Date', 'MaxT', 'MinT', 'RH1', 'RH2', 'Wind', 'Rain', 'Evap', 'Radiation', 'Lat', 'Lon', 'Cum_Rain'])
    return df

def get_predictions_and_spei(start_date, end_date, region):
    df = fetch_weather_data(region)
    df['Date'] = pd.to_datetime(df['Date'])
    dff = df[['Date', 'MaxT', 'MinT', 'RH1', 'RH2', 'Wind', 'Rain', 'Evap', 'Radiation', 'Lat', 'Lon', 'Cum_Rain']]
    X = dff.drop('Date', axis=1)
    scaler = MinMaxScaler()
    scaler.fit(X)
    inp = X.tail(7).to_numpy()
    inp_norm = scaler.transform(inp)
    serri = inp_norm.reshape(1, 7, 11)
    p_date = {}
    date_range = pd.date_range(start_date, end_date, freq='D')
    spei_value_avg =0
    res_dict = {}
    res_list = []
    for i in range(len(date_range) - 1):
        current_date = date_range[i]
        day_of_year = current_date.dayofyear
        predict = model.predict(serri)
        pre_inv = scaler.inverse_transform(predict)
        precipitation_day = pre_inv[0][5]
        evaporation_day = pre_inv[0][6]
        spei_value = calculate_spei_one_day(day_of_year, precipitation_day, evaporation_day, daily_stats)
        p_date[str(current_date).split(" ")[0]] = {"prediction": pre_inv.tolist(), "spei": spei_value}
        spei_value_avg += spei_value
    for key, value in p_date.items():
        value["prediction"] = transform_list_to_dict(value["prediction"][0])
        prepare = value["prediction"]
        prepare = {k: v for k, v in prepare.items()}
        prepare["spei"] = value["spei"]
        prepare["date"] = key
        res_list.append(prepare)
    return res_list, spei_value_avg / len(date_range)

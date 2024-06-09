import numpy as np
import pandas as pd
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from scipy.stats import norm

# Load the pre-trained model
model = load_model('drought_prediction_model.keras')

daily_stats = pd.read_csv('daily_statistics.csv')



def calculate_spei_one_day(day_of_year, precipitation, evaporation, stats):
    ref_precip_mean = stats.loc[stats['DayOfYear'] == day_of_year, 'Precip_Mean'].values[0]
    ref_precip_std = stats.loc[stats['DayOfYear'] == day_of_year, 'Precip_Std'].values[0]
    ref_evap_mean = stats.loc[stats['DayOfYear'] == day_of_year, 'Evap_Mean'].values[0]
    ref_evap_std = stats.loc[stats['DayOfYear'] == day_of_year, 'Evap_Std'].values[0]

    # Compute standardized anomalies
    precip_anomaly = (precipitation - ref_precip_mean) / ref_precip_std
    evap_anomaly = (evaporation - ref_evap_mean) / ref_evap_std

    # Combine the anomalies
    D_anomaly = precip_anomaly - evap_anomaly

    # Convert the anomaly to a standardized SPEI value using the inverse normal CDF (probit function)
    spei_value = norm.ppf(norm.cdf(D_anomaly))

    return spei_value

# Read the dataset
df = pd.read_csv("data_cpy.csv")
df['Date'] = pd.to_datetime(df['Date'])

# Select relevant columns
dff = df[['Date', 'MaxT', 'MinT', 'RH1', 'RH2', 'Wind', 'Rain', 'Evap', 'Radiation', 'Lat', 'Lon', 'Cum_Rain']]

# Fix specific data point
X = dff.drop('Date', axis=1)

# Scale the features
scaler = MinMaxScaler()
scaler.fit(X)

inp = X.tail(7).to_numpy()
inp_norm = scaler.transform(inp)
serri = inp_norm.reshape(1, 7, 11)

def get_predictions_and_spei(start_date, end_date):
    p_date = {}
    date_range = pd.date_range(start_date, end_date, freq='D')
    
    for i in range(len(date_range) - 1):  # Subtract 1 because we're predicting the next day
        current_date = date_range[i]
        day_of_year = current_date.dayofyear
        
        # Predict
        predict = model.predict(serri)
        pre_inv = scaler.inverse_transform(predict)
        
        # Calculate SPEI for the new data point
        precipitation_day = pre_inv[0][5]  # Assuming 'Rain' is the 6th column
        evaporation_day = pre_inv[0][6]    # Assuming 'Evap' is the 7th column
        spei_value = calculate_spei_one_day(day_of_year, precipitation_day, evaporation_day, daily_stats)
        
        p_date[current_date] = {"prediction": pre_inv, "spei": spei_value}
    
    return p_date

# Example usage
start_date = pd.to_datetime('2023-09-01')
end_date = pd.to_datetime('2023-09-30')
p_date_result = get_predictions_and_spei(start_date, end_date)

for date, values in p_date_result.items():
    print(date, values)

import numpy as np
import pandas as pd
# import keras
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from scipy.stats import norm
# Load the pre-trained model
model = load_model('drought_prediction_model.keras')

# Read the dataset
# df = pd.read_csv("Data_set.csv")
# df['Date'] = pd.to_datetime(df['Date'])

# Read daily statistics from CSV file
daily_stats = pd.read_csv('daily_statistics.csv')

# Function to calculate SPEI for one day
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

# Load the pre-trained model
model = load_model('drought_prediction_model.keras')

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

# Predict drought using the model
predictions = []
spei_one_day = []
# Output predictions and SPEI for each date
start_date = pd.to_datetime('2023-09-01')
end_date = pd.to_datetime('2023-09-30')
date_range = pd.date_range(start_date, end_date, freq='D')


current_date = date_range[0]
day_of_year = current_date.dayofyear
predict = model.predict(serri)
pre_inv = scaler.inverse_transform(predict)
predictions.append(pre_inv)
np.concatenate((inp[1:], pre_inv), axis=0)
precipitation_day = predictions[0][0][5]  # Assuming 'Rain' is the 6th column
evaporation_day = predictions[0][0][6]    # Assuming 'Evap' is the 7th column
spei_value = calculate_spei_one_day(day_of_year, precipitation_day, evaporation_day, daily_stats)
spei_one_day.append(spei_value)
# print(len(spei_one_day))

# Calculate SPEI for one day


for i in range(29):
    

    current_date = date_range[i+1]
    day_of_year = current_date.dayofyear
    
    #predict
    predict = model.predict(serri)
    pre_inv = scaler.inverse_transform(predict)
    
    # Calculate SPEI for the new data point
    predictions.append(pre_inv)
    np.concatenate((inp[1:], pre_inv), axis=0)
    precipitation_day = predictions[0][0][5]  # Assuming 'Rain' is the 6th column
    evaporation_day = predictions[0][0][6]    # Assuming 'Evap' is the 7th column
    spei_value = calculate_spei_one_day(day_of_year, precipitation_day, evaporation_day, daily_stats)
    spei_one_day.append(spei_value)

p_date = {}
for i in range(len(predictions)):
    p_date[date_range[i]] = {"prediction": predictions[i], "spei": spei_one_day[i]}

for date, values in p_date.items():
    print(date, values)




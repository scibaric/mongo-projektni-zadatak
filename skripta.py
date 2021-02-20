import urllib.request as urllib
import numpy as np

url = "https://archive.ics.uci.edu/ml/machine-learning-databases/water-treatment/water-treatment.data"
raw_data = urllib.urlopen(url)
with open('water-treatment.csv', 'wb') as file:
    file.write(raw_data.read())
# SmartKissan

### Overview
This project focuses on crop monitoring using remote sensing data, specifically Landsat 8 satellite imagery. The primary goal is to calculate and visualize the **Normalized Difference Vegetation Index (NDVI)**, a key indicator of plant health and vegetation density.

## Features
- Loading and processing **Landsat 8** satellite imagery
- Calculation of **NDVI (Normalized Difference Vegetation Index)**
- Visualization of **NDVI maps** with appropriate color schemes
- Handling of **geospatial data** using the `rasterio` library

## Requirements
This project requires the following Python libraries:

- `numpy`
- `rasterio`
- `matplotlib`
- `google.colab` (for Google Colab integration)

You can install the required packages using pip:

```sh
pip install rasterio numpy matplotlib
```

## Usage
### 1. Mount Google Drive (if using Google Colab):
```python
from google.colab import drive
drive.mount('/content/drive')
```

### 2. Load the Landsat 8 bands (Red and Near-Infrared):
```python
red_band_path = '/path/to/your/LC08_L2SP_142048_20240328_20240410_02_T1_SR_B3.TIF'
nir_band_path = '/path/to/your/LC08_L2SP_142048_20240328_20240410_02_T1_SR_B4.TIF'
```

### 3. Calculate NDVI:
```python
import numpy as np
import rasterio
import matplotlib.pyplot as plt

with rasterio.open(red_band_path) as red_src, rasterio.open(nir_band_path) as nir_src:
    red_band = red_src.read(1).astype(float)
    nir_band = nir_src.read(1).astype(float)
    
    np.seterr(divide='ignore', invalid='ignore')
    ndvi = (nir_band - red_band) / (nir_band + red_band)
    ndvi[np.isnan(ndvi)] = 0
```

### 4. Visualize the NDVI:
```python
plt.imshow(ndvi, cmap='RdYlGn')
plt.colorbar()
plt.title('NDVI')
plt.show()
```

## Data
This project uses **Landsat 8 Surface Reflectance** data from **March 28, 2024**, specifically:
- **Band 3 (Red):** `LC08_L2SP_142048_20240328_20240410_02_T1_SR_B3.TIF`
- **Band 4 (Near-Infrared):** `LC08_L2SP_142048_20240328_20240410_02_T1_SR_B4.TIF`

## NDVI Interpretation
The NDVI values range from **-1 to 1**:
- **Values close to 1 (green):** Healthy vegetation
- **Values around 0 (yellow):** Sparse vegetation or soil
- **Negative values (red):** Water, snow, clouds, or non-vegetated surfaces

## Future Enhancements
Potential improvements for this project include:
- **Time-series analysis** of vegetation changes
- Integration of **other vegetation indices** (EVI, SAVI, etc.)
- **Land cover classification**
- **Crop health monitoring** and **yield prediction**

## License
This project is open-source and available for **educational and research purposes**.

## Acknowledgements
- **USGS** for providing **Landsat 8** data
- **Rasterio** and **NumPy** communities for their excellent libraries

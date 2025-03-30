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

## Gallery

### Front-End GUI

![Screenshot 2025-03-30 110509](https://github.com/user-attachments/assets/7a09ea54-3228-41bf-b8ab-b2649a3304b3)

![Screenshot 2025-03-30 110538](https://github.com/user-attachments/assets/126932cd-8f89-4791-a17f-dae7887ffb56)

![Screenshot 2025-03-30 110620](https://github.com/user-attachments/assets/085a5474-3228-4a11-8d96-02381e6b818a)

![Screenshot 2025-03-30 110629](https://github.com/user-attachments/assets/6c686a6b-699b-4b27-b55e-c12144104326)

![Screenshot 2025-03-30 110700](https://github.com/user-attachments/assets/80f1d5df-e252-4f1c-9c7f-33235275b834)

![Screenshot 2025-03-30 110748](https://github.com/user-attachments/assets/4335dfb7-5c14-48dd-84c8-57e8918429b6)

![Screenshot 2025-03-30 110812](https://github.com/user-attachments/assets/0863d624-5480-4b25-a82e-0c4ab7bd02f2)

![Screenshot 2025-03-30 110924](https://github.com/user-attachments/assets/a02e4c85-1dd6-47af-990e-05ae3502643d)

![Screenshot 2025-03-30 110950](https://github.com/user-attachments/assets/98c03ec7-ec21-4ce9-9216-c55b65a89859)

![Screenshot 2025-03-30 111018](https://github.com/user-attachments/assets/e1e06006-b762-44d2-9785-2e2a8911d876)

![Screenshot 2025-03-30 111028](https://github.com/user-attachments/assets/db0e57ec-2733-429b-bb44-19e9ad6cc7ab)

![Screenshot 2025-03-30 112318](https://github.com/user-attachments/assets/78ddf44d-e315-4349-a38e-a03c1dd610e9)

### Model outcomes

![WhatsApp Image 2025-03-30 at 10 59 41](https://github.com/user-attachments/assets/bc94efe7-e269-4e57-9b81-8b989cf3ccb5)

![WhatsApp Image 2025-03-30 at 11 14 54](https://github.com/user-attachments/assets/e52409c4-6a1b-4627-a9e5-84f9911bb345)

![WhatsApp Image 2025-03-30 at 11 12 06](https://github.com/user-attachments/assets/9488ee1d-c358-4b26-9a08-f4721ffb12c7)

![WhatsApp Image 2025-03-30 at 11 12 49](https://github.com/user-attachments/assets/eacceda1-4c83-4666-acdf-52aeea936924)

![WhatsApp Image 2025-03-30 at 11 13 20](https://github.com/user-attachments/assets/f468cb14-6603-463d-9d77-23d5779ba5d7)

![WhatsApp Image 2025-03-30 at 11 13 47](https://github.com/user-attachments/assets/4cd85009-272a-4620-8248-cc5ffa6d78fe)

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

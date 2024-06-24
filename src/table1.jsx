import React, { useState, useEffect } from 'react';
import { Table, Space, MantineProvider } from '@mantine/core';
import data from './data.json'; // Import the JSON data

const MainApp = () => {
  const [cropData, setCropData] = useState(data); // for storing the data
  const [maxProductionTable, setMaxProductionTable] = useState([]); // for storing max and min produced initialy empty
  const [averageData, setAverageData] = useState([]); // for storing average data initially empty
  
  // will update after every render if cropdata changes //
  useEffect(() => {
    setMaxProductionTable(calculateMaxMinProduction(cropData));
    setAverageData(calculateAverageYieldArea(cropData));
  }, [cropData]);

  // function to calculate the maximum and minimum produced crop
  const calculateMaxMinProduction = (data) => {
    // will store the values in result
    const result = [];
    // extracting the year from the string
    const years = [...new Set(data.map((item) => parseInt(item.Year.split(', ')[1].trim(), 10)))];
  
    years.forEach((year) => {
      let maxProduction = { production: 0, crop: '' };
      let minProduction = { production: Infinity, crop: '' };
  
      const yearData = data.filter((item) => parseInt(item.Year.split(', ')[1].trim(), 10) === year);
    
      // for every year data will calculate the max and min production
      yearData.forEach((item) => {
        const productionValue = parseFloat(item['Crop Production (UOM:t(Tonnes))']);
        if (!isNaN(productionValue)) {
          if (productionValue > maxProduction.production) {
            maxProduction = { production: productionValue, crop: item['Crop Name'] };
          }
          if (productionValue > 0 && productionValue < minProduction.production) {
            minProduction = { production: productionValue, crop: item['Crop Name'] };
          }
        }
      });
  
      result.push({
        year: year,
        maxCrop: maxProduction.production > 0 ? maxProduction.crop : '...',
        minCrop: minProduction.production < Infinity ? minProduction.crop : '...',
      });
    });
  
    return result;
  };
  
// function to calculate the average
  const calculateAverageYieldArea = (data) => {
    
    const result = [];
    const crops = [...new Set(data.map((item) => item['Crop Name']))];
   // checking for each crop 
    crops.forEach((crop) => {
      const cropData = data.filter((item) => item['Crop Name'] === crop);
      const totalProduction = cropData.reduce(
        (acc, cur) => acc + (parseFloat(cur['Crop Production (UOM:t(Tonnes))']) || 0),
        0
      );
      // calculating total area
      const totalArea = cropData.reduce(
        (acc, cur) => acc + (parseFloat(cur['Area Under Cultivation (UOM:Ha(Hectares))']) || 0),
        0
      );
       // calculating average yield
      const averageYield =
        totalProduction / cropData.length > 0
          ? parseFloat((totalProduction / cropData.length).toFixed(3))
          : 0;
      
       // Calculating average area
          const averageArea =
        totalArea / cropData.length > 0
          ? parseFloat((totalArea / cropData.length).toFixed(3))
          : 0;
        
          // pushing the data in result arr
      result.push({
        crop: crop,
        averageYield: averageYield,
        averageArea: averageArea,
      });
    });

    return result;
  };
  // for table 1
  // these helper functions will be used in mantine tyable component for code modularity
  const rows1 = maxProductionTable.map((element) => (
    <Table.Tr key={element.year}>
      <Table.Td style={{ width: '200px', textAlign:'center', textWrap:'wrap'}}>{element.year}</Table.Td> {/* Set column width */}
      <Table.Td style={{ width: '250px', textAlign:'center' }}>{element.maxCrop}</Table.Td>
      <Table.Td style={{ width: '250px', textAlign:'center' }}>{element.minCrop}</Table.Td>
    </Table.Tr>
  ));

  // for table2
  const rows2 = averageData.map((element) => (
    <Table.Tr key={element.crop}>
      <Table.Td style={{ width: '200px',textAlign:'center', textWrap:'wrap' }}>{element.crop}</Table.Td> 
      <Table.Td style={{ width: '250px',textAlign:'center' }}>{element.averageYield}</Table.Td>
      <Table.Td style={{ width: '250px',textAlign:'center' }}>{element.averageArea}</Table.Td>
    </Table.Tr>
  ));

  return (
    <MantineProvider>
      <div style={{ padding: 20 }}> 
        <h2>Table 1: Crops with Maximum and Minimum Production</h2>
        <Table striped highlightOnHover style={{ border: '1px solid #ddd' }}> 
      
          <Table.Thead > 
            <Table.Tr withColumnBorders> 
              <Table.Th>Year</Table.Th>
              <Table.Th>Crop with Maximum Production in that Year</Table.Th>
              <Table.Th>Crop with Minimum Production in that Year</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody withColumnBorders>
                        {/** helper function declared earlier in line 87- 101 **/}
                        {rows1}
          </Table.Tbody>
        </Table>
      </div>
      <div style={{ padding: 20, marginTop: 40 }}> 
        <h2>Table 2: Average Yield and Area of Crops</h2>
        <Table striped highlightOnHover style={{ border: '1px solid #ddd' }}> 
          
          <Table.Thead >
            <Table.Tr withColumnBorders>
              <Table.Th>Crop</Table.Th>
              <Table.Th>Average Yield of theCrop between 1950-2020</Table.Th>
              <Table.Th>Average Cultivation Area of the Crop between 1950-2020
</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody withColumnBorders>
                  {/** helper function declared earlier in line 87- 101 **/}
                  {rows2}
          </Table.Tbody>
        </Table>
      </div>
    </MantineProvider>
  );
};

export default MainApp;

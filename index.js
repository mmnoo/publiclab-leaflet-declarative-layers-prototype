{
    const map = new L.Map('map', { zoom: 7, center: new L.LatLng(49.5, -115)});
    const basemap = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');		
    map.addLayer(basemap); 
    const declaredLayers = new L.DeclarativeLayers(map)  

    const genrateNativeLandInfoWindowContent = feature => feature.properties.Name
    const generateNativeLandFeatureStyle = feature => {
        return {
            fill: true,
            fillColor: feature.properties.color,
            color: feature.properties.color
        }
    }

    const initializeMetadata = async () => {
        const positionString = `position=${map.getCenter().lat},${map.getCenter().lng}`
        const dataUrls = [
            `https://native-land.ca/api/index.php?maps=languages&${positionString}`,
            `https://native-land.ca/api/index.php?maps=territories&${positionString}`,
        ]
        const responses = await Promise.all(dataUrls.map(url => fetch(url)))
        const data = responses.map(response => response.json())
        const languageData = await data[0]
        const territoriesData = await data[1]
        
        const layerMetadata = [
            {
                id: 'Native Languages',
                label: 'Native Languages',
                data: languageData,
                generateFeaturePopupContent: genrateNativeLandInfoWindowContent,
                options: { style : generateNativeLandFeatureStyle },
            },{
                id: 'Native Territories',
                label: 'Native Territories',
                data: territoriesData,
                generateFeaturePopupContent: genrateNativeLandInfoWindowContent,
                options: { style : generateNativeLandFeatureStyle },
            },{
                id: 'Open Infrastructure Power',
                label: 'Open Infrastructure Power',
                url: 'https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png',
                options: {
                    attribution: `&copy; 
                    <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
                    <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>`
                }
            }
        ];
        // This is for demonstration only! You should probably use a framework!
        const list = getLegendElement(layerMetadata)
        const legendContainer = document.getElementById('legendContainer')
        legendContainer.innerHTML = ''
        legendContainer.appendChild(list)
    } 

    initializeMetadata()

    const getLegendElement = (layerMetadata) => {
        // This is for demonstration only! You should probably use a framework!
        const list = document.createElement('ul')
        Object.keys(layerMetadata).forEach(key => {
            const metadataObject = layerMetadata[key]
            const listItem = document.createElement('li')
            const checkbox = document.createElement('input')
            const label = document.createElement('label')

            checkbox.type = 'checkbox'
            checkbox.value = metadataObject.id
            checkbox.name = metadataObject.id
            checkbox.onclick = toggleLayers
            label.htmlFor = metadataObject.id
            label.appendChild(document.createTextNode(metadataObject.label))

            listItem.appendChild(checkbox)
            listItem.appendChild(label)
            list.appendChild(listItem)
        })
        return list
    }

    const toggleLayers = (value) => {
        // Leaflet Declarative Layers will have its own toggleLayers function in the future. 
        console.log("click", value.target.value)
        
    }
}



const WS_URL = 'wss://www.machineryhuntersplatform.net:8081';
// const WS_URL = '';
var websocket = null;

var phoneCountries = ["us", "ca", "co", "mx", "pe", "ec", "sv"];

var countryCodes = [
    {
        country : 'United State',
        iso1 : 'us',
        countryCode : '1',
        countryCodeLength : 2, // +1
        areaCodeLength : 3,
        cityCodeLength : 3,
        personCodeLength : 4
    },
    {
        country : 'Canada',
        iso1 : 'ca',
        countryCode : '1',
        countryCodeLength : 2, // +1
        areaCodeLength : 3,
        cityCodeLength : 3,
        personCodeLength : 4
    },
    {
        country : 'Colombia',
        iso1 : 'co',
        countryCode : '57',
        countryCodeLength : 3, // +1
        areaCodeLength : 3,
        cityCodeLength : 3,
        personCodeLength : 4
    },
    {
        country : 'Mexico',
        iso1 : 'mx',
        countryCode : '52',
        countryCodeLength : 3, // +1
        areaCodeLength : 3,
        cityCodeLength : 3,
        personCodeLength : 4
    },
    {
        country : 'Peru',
        iso1 : 'pe',
        countryCode : '51',
        countryCodeLength : 3, // +1
        areaCodeLength : 3,
        cityCodeLength : 3,
        personCodeLength : 3
    },
    {
        country : 'ec',
        iso1 : 'Ecuador',
        countryCode : '593',
        countryCodeLength : 4, // +1
        areaCodeLength : 2,
        cityCodeLength : 3,
        personCodeLength : 3
    },
    {
        country : 'El Salvador',
        iso1 : 'sv',
        countryCode : '503',
        countryCodeLength : 4, // +1
        areaCodeLength : 0,
        cityCodeLength : 4,
        personCodeLength : 4
    }
]

var phoneCountryCodeChange = function(e) {
    var countryCode = $(e.target).intlTelInput('getSelectedCountryData').iso2;
    if (countryCode == 'ec') 
        $(e.target).mask("99 999 9999");       
    else if (countryCode == 'sv')
        $(e.target).mask('9999 9999');       
    else if (countryCode == 'pe')
        $(e.target).mask('999 999 999');
    else
        $(e.target).mask('999 999 9999');
}

var Locations = [
    {
        country: 'USA',
        state: [
            { name: 'Alabama', abbreviation: 'AL' },
            { name: 'Alaska', abbreviation: 'AK' },
            { name: 'Arizona', abbreviation: 'AZ' },
            { name: 'Arkansas', abbreviation: 'AR' },
            { name: 'California', abbreviation: 'CA' },
            { name: 'Colorado', abbreviation: 'CO' },
            { name: 'Connecticut', abbreviation: 'CT' },
            { name: 'Delaware', abbreviation: 'DE' },
            { name: 'Florida', abbreviation: 'FL' },
            { name: 'Georgia', abbreviation: 'GA' },
            { name: 'Hawaii', abbreviation: 'HI' },
            { name: 'Idaho', abbreviation: 'ID' },
            { name: 'Illinois', abbreviation: 'IL' },
            { name: 'Indiana', abbreviation: 'IN' },
            { name: 'Iowa', abbreviation: 'IA' },
            { name: 'Kansas', abbreviation: 'KS' },
            { name: 'Kentucky', abbreviation: 'KY' },
            { name: 'Louisiana', abbreviation: 'LA' },
            { name: 'Maine', abbreviation: 'ME' },
            { name: 'Maryland', abbreviation: 'MD' },
            { name: 'Massachusetts', abbreviation: 'MA' },
            { name: 'Michigan', abbreviation: 'MI' },
            { name: 'Minnesota', abbreviation: 'MN' },
            { name: 'Mississippi', abbreviation: 'MS' },
            { name: 'Missouri', abbreviation: 'MO' },
            { name: 'Montana', abbreviation: 'MT' },
            { name: 'Nebraska', abbreviation: 'NE' },
            { name: 'Nevada', abbreviation: 'NV' },
            { name: 'New Hampshire', abbreviation: 'NH' },
            { name: 'New Jersey', abbreviation: 'NJ' },
            { name: 'New Mexico', abbreviation: 'NM' },
            { name: 'New York', abbreviation: 'NY' },
            { name: 'North Carolina', abbreviation: 'NC' },
            { name: 'North Dakota', abbreviation: 'ND' },
            { name: 'Ohio', abbreviation: 'OH' },
            { name: 'Oklahoma', abbreviation: 'OK' },
            { name: 'Oregon', abbreviation: 'OR' },
            { name: 'Pennsylvania', abbreviation: 'PA' },
            { name: 'Rhode Island', abbreviation: 'RI' },
            { name: 'South Carolina', abbreviation: 'SC' },
            { name: 'South Dakota', abbreviation: 'SD' },
            { name: 'Tennessee', abbreviation: 'TN' },
            { name: 'Texas', abbreviation: 'TX' },
            { name: 'Utah', abbreviation: 'UT' },
            { name: 'Vermont', abbreviation: 'VT' },
            { name: 'Virginia', abbreviation: 'VA' },
            { name: 'Washington', abbreviation: 'WA' },
            { name: 'West Virginia', abbreviation: 'WV' },
            { name: 'Wisconsin', abbreviation: 'WI' },
            { name: 'Wyoming', abbreviation: 'WY' },
            { name: 'American Samoa', abbreviation: 'AS' },
            { name: 'District of Columbia', abbreviation: 'DC' },
            { name: 'Federated States of Micronesia', abbreviation: 'FM' },
            { name: 'Guam', abbreviation: 'GU' },
            { name: 'Marshall Islands', abbreviation: 'MH' },
            { name: 'Northern Mariana Islands', abbreviation: 'MP' },
            { name: 'Palau', abbreviation: 'PW' },
            { name: 'Puerto Rico', abbreviation: 'PR' },
            { name: 'Virgin Islands', abbreviation: 'VI' }
        ],
    },

    {
        country: 'Mexico',
        state: [
            { name: 'Aguascalientes', abbreviation: 'Aguascalientes' },
            { name: 'Baja California', abbreviation: 'Baja California' },
            { name: 'Baja California Sur', abbreviation: 'Baja California Sur' },
            { name: 'Campeche', abbreviation: 'Campeche' },
            { name: 'Chiapas', abbreviation: 'Chiapas' },
            { name: 'Chihuahua', abbreviation: 'Chihuahua' },
            { name: 'Coahuila', abbreviation: 'Coahuila' },
            { name: 'Colima', abbreviation: 'Colima' },
            { name: 'Mexico City', abbreviation: 'Mexico City' },
            { name: 'Durango', abbreviation: 'Durango' },
            { name: 'Guanajuato', abbreviation: 'Guanajuato' },
            { name: 'Guerrero', abbreviation: 'Guerrero' },
            { name: 'Hidalgo', abbreviation: 'Hidalgo' },
            { name: 'Jalisco', abbreviation: 'Jalisco' },
            { name: 'México', abbreviation: 'México' },
            { name: 'Michoacán', abbreviation: 'Michoacán' },
            { name: 'Morelos', abbreviation: 'Morelos' },
            { name: 'Nayarit', abbreviation: 'Nayarit' },
            { name: 'Nuevo León', abbreviation: 'Nuevo León' },
            { name: 'Oaxaca', abbreviation: 'Oaxaca' },
            { name: 'Puebla', abbreviation: 'Puebla' },
            { name: 'Querétaro', abbreviation: 'Querétaro' },
            { name: 'Quintana Roo', abbreviation: 'Quintana Roo' },
            { name: 'San Luis Potosí', abbreviation: 'San Luis Potosí' },
            { name: 'Sinaloa', abbreviation: 'Sinaloa' },
            { name: 'Sonora', abbreviation: 'Sonora' },
            { name: 'Tabasco', abbreviation: 'Tabasco' },
            { name: 'Tamaulipas', abbreviation: 'Tamaulipas' },
            { name: 'Tlaxcala', abbreviation: 'Tlaxcala' },
            { name: 'Veracruz', abbreviation: 'Veracruz' },
            { name: 'Yucatán', abbreviation: 'Yucatán' },
            { name: 'Zacatecas', abbreviation: 'Zacatecas' }
        ],
    },

    {
        country: 'Canada',
        state: [

            { name: 'Saskatchewan', abbreviation: 'SK' },
            { name: 'Alberta', abbreviation: 'AB' },
            { name: 'British Columbia', abbreviation: 'BC' },
            { name: 'Manitoba', abbreviation: 'MB' },
            { name: 'New Brunswick', abbreviation: 'NB' },
            { name: 'Newfoundland and Labrador', abbreviation: 'NL' },
            { name: 'Nova Scotia', abbreviation: 'NS' },
            { name: 'Northwest Territories', abbreviation: 'NT' },
            { name: 'Nunavut', abbreviation: 'NU' },
            { name: 'Ontario', abbreviation: 'ON' },
            { name: 'Prince Edward Island', abbreviation: 'PE' },
            { name: 'Quebec', abbreviation: 'QC' },
            { name: 'Yukon', abbreviation: 'YT' },

        ],
    },
];

var Tranlate_word_array = [

    { english: 'Boom Truck', spanish: 'Grúa Titán' },
    { english: 'Knuckle Boom Truck', spanish: 'Grúa Articulada' },
    { english: 'Loader Backhoe', spanish: 'Retroexcavadora' },
    { english: 'Concrete Pump Truck', spanish: 'Bomba de Concreto' },
    { english: 'Bucket Truck', spanish: 'Grúa Canastilla' },
    { english: 'Crane', spanish: 'Grúa' },
    { english: 'Excavator', spanish: 'Excavadora' },
    { english: 'Dozer', spanish: 'Topador Frontal' },
    { english: 'Forklift', spanish: 'Montacargas' },
    { english: 'Generator', spanish: 'Generador' },
    { english: 'Lift', spanish: 'Elevador' },
    { english: 'Motor Grader', spanish: 'Motoconformadora' },
    { english: 'Skid Steer', spanish: 'Minicargador' },
    { english: 'Tow Truck', spanish: 'Grúa de arrastre' },
    { english: 'Truck', spanish: 'Camión' },
    { english: 'Agriculture', spanish: 'Agrícola' },
    { english: 'Bus', spanish: 'Autobus' },
    { english: 'Chasis Truck', spanish: 'Camión Chasis' },
    { english: 'Digger Derrick Truck', spanish: 'Grúa Broca' },
    { english: 'Dump Truck', spanish: 'Camión de Volteo' },
    { english: 'Garbage Truck', spanish: 'Camión Recolector' },
    { english: 'Mixer Truck', spanish: 'Trompo Revolvedor' },
    { english: 'Mini Excavator', spanish: 'Mini Excavadora'},
    { english: 'Motor Grader', spanish: 'Motoconformadora' },
    { english: 'Roll Off Truck', spanish: 'Roll Off' },
    { english: 'Reefer Truck', spanish: 'Camión Refrigerado'},
    { english: 'Box Truck', spanish: 'Camión Caja Seca'},
    { english: 'Platform Truck', spanish: 'Camión Plataforma'},
    { english: 'Stationary Concrete Pump', spanish: 'Bomba de Concreto Estacionaria' },
    { english: 'Service Truck', spanish: 'Camión de Servicio'},
    { english: 'Trailer', spanish: 'Remolque' },
    { english: 'Drum Roller', spanish: 'Vibrocompactador'},
    { english: 'Unmounted Boom', spanish: 'Pluma Desmontada' },
    { english: 'Vacuum Truck', spanish: 'Limpia Drenaje' },
    { english: 'Water Truck', spanish: 'Pipa de agua' },
    { english: 'Articulated', spanish: 'Articulado' },
    { english: 'Telescopic', spanish: 'Telescópico' },
    { english: 'Scissor', spanish: 'Tijera' },
    { english: 'Wheel Loader', spanish: 'Cargador Frontal'},
    { english: 'Other', spanish: 'Otros'},
    { english: 'Accessory', spanish: 'Accesorio'},
    { english: 'Parts', spanish: "Refacción" },
    { english: 'Pneumatic', spanish: 'Neumático' },
    { english: 'Replacements', spanish: "Refacciones"},
    { english: 'Towable', spanish: 'Remolcable' },
    { english: 'Auction', spanish: 'Subasta' },
    { english: 'For Sale', spanish: 'Proveedor' },
    { english: 'Consignment', spanish: 'Consignación' },
    { english: 'Inventory', spanish: 'Inventario' },
    { english: 'Manufacturing Dump Truck', spanish: 'Fabricación Camión Volteo'},
    { english: 'Manufacturing Water Truck', spanish: 'Fabricación Pipa Agua'}
]


/////////////////////////////////////

var Special_field_array = [
    {
        category: 'Accessory',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Type'],
        has_truck_info: false,
        title: ['Type'],
        details: ['EqYear', 'EqMake', 'EqModel'],
        unit: { }
    },
    {
        category: 'Agriculture',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Type', 'Engine', 'HorsePower'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'Type'],
        details: ['Type', 'EqModel', 'Engine', 'HorsePower'],
        unit: { HorsePower : 'hp'}
    },
    {
        category: 'Boom Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        has_truck_info: true,   // truck_info = truckyear, truckmake, truckmodel, trucktrans, truckcondition, engine        
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['Engine', 'TruckTrans', 'EqMake', 'EqModel', , 'Suspension', 'TruckCondition', 'Length'],
        unit: { Capacity: 'ton' }
        
    },
    {
        category: 'Bucket Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Length'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Length'],
        details: ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition'],
        unit: { }
    },
    {
        category: 'Bus',
        equip_info_fields: ['EqSN', 'Capacity'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { Capacity : 'pas'}
    },
    {
        category: 'Chasis Truck',
        equip_info_fields: ['EqSN'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'TruckModel'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { }
    },
    {
        category: 'Concrete Pump Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Type'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['EqMake', 'EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { Capacity: 'm' }
    },
    {
        category: 'Crane',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'Capacity'],
        details: ['EqModel', 'Length'],
        unit: { Capacity: 'ton' }
    },
    {
        category: 'Digger Derrick Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Length'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'EqModel'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { }
    },
    {
        category: 'Dozer',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Cab', 'Hours', 'Ripper', 'Type'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', 'Ripper'],
        unit: { Hours: 'Horas' }
    },
    {
        category: 'Dump Truck',
        equip_info_fields: ['EqSN', 'Type'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Type'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { }
    },
    {
        category: 'Excavator',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'AuxHyd', 'Hours', 'Length'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', 'Length', 'AuxHyd'],
        unit: { Hours: 'Horas' }
    },
    {
        category: 'Forklift',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Length', 'Capacity'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', 'Length', 'Capacity'],
        unit: { Capacity: 'lbs', Hours: 'Horas' }
    },
    {
        category: 'Garbage Truck',
        equip_info_fields: ['EqSN', 'Capacity', 'Type'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { Capacity: 'yd' }
    },
    {
        category: 'Generator',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Hours', 'Type'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', 'Type', 'Capacity'],
        unit: { Capacity: 'kw', Hours: 'Horas' }
    },
    {
        category: 'Knuckle Boom Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition', 'Length'],
        unit: { Capacity: 'ton'}
    },
    {
        category: 'Lift',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Length', 'Type'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', 'Length'],
        unit: { Hours: 'Horas' }
    },
    {
        category: 'Loader Backhoe',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', '4WD', 'Ext', 'AuxHyd', 'Cab', 'Hours'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', '4WD', 'Ext', 'AuxHyd'],
        unit: { Hours: 'Horas' }

    },
    {
        category: 'Mini Excavator',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'AuxHyd', 'Hours'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['AuxHyd', 'Hours'],
        unit: { Hours : 'Horas'}
    },  
    {
        category: 'Mixer Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['Engine', 'TruckTrans', 'EqMake', 'EqModel',  'Suspension', 'TruckCondition'],
        unit: { Capacity : 'yd'}
    },    
    {
        category: 'Parts',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Type'],
        has_truck_info: false,
        title: ['Type'],
        details: ['EqYear', 'EqMake', 'EqModel'],
        unit: { }
    },
    {
        category: 'Platform Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Length'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Length'],
        details: ['TruckTrans', 'Suspension', 'TruckCondition'],
        unit: {}
    },
    {
        category: 'Replacements',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Type'],
        has_truck_info: false,
        title: ['Type'],
        details: ['EqYear', 'EqMake', 'EqModel'],
        unit: {}
    },
    {
        category: 'Motor Grader',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Ripper'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours', 'Ripper'],
        unit: { Hours: 'Horas' }
    },
    {
        category: 'Service Truck',
        equip_info_fields : [],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'TruckModel'],
        details : ['TruckYear', 'TruckMake', 'TruckModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: {}
    },
    {
        category:  'Reefer Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Length'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'EqMake'],
        details: ['EqModel', 'Length'],
        unit: {}
    },
    {
        category: 'Box Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Length'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Length'],
        details: ['EqModel', 'Length'],
        unit: {}
    },
    {
        category: 'Drum Roller',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Cab', 'Length'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Cab', 'Length'],
        unit: {}
    },

    {
        category: 'Roll Off Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition'],
        unit: { Capacity : 'lbs'}
    },
    {
        category: 'Skid Steer',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Type', 'Cab'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours'],
        unit: { Hours: 'Horas' }
    },
    {
        category: 'Stationary Concrete Pump',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours'],
        unit: { Hours: 'Horas'}
    },
    {
        category: 'Tow Truck',
        equip_info_fields: ['EqSn', 'Capacity'],
        has_truck_info: true,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Engine', 'TruckTrans', 'Capacity',],
        unit: { Capacity: 'ton' }
    },
    {
        category: 'Trailer',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        has_truck_info: false,
        title: ['EqkYear', 'EqkMake', 'Capacity'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { Capacity : 'lbs'}
    },
    {
        category: 'Truck',
        equip_info_fields: ['Cab'],
        has_truck_info: true,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Engine', 'TruckTrans', 'TruckCondition'],
        unit: {}
    },
    {
        category: 'Unmounted Boom',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'Capacity', 'Type', 'Length'],
        has_truck_info: false,
        title: ['EqYear', 'EqkMake', 'Capacity'],
        details: ['Type', 'EqModel', 'Length', 'Capacity'],
        unit: { Capacity : 'ton'}
    },
    {
        category: 'Vacuum Truck',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'EqModel'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: {}
    },
    {
        category: 'Wheel Loader',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Cab', 'Hours'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: ['Hours'],
        unit: { Hours: 'Horas' }
    },
    {
        category: 'Water Truck',
        equip_info_fields: ['EqSN', 'Capacity'],
        has_truck_info: true,
        title: ['TruckYear', 'TruckMake', 'Capacity'],
        details: ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        unit: { Capacity: 'gal' }
    },
    {
        category: 'Other',
        equip_info_fields: ['EqYear', 'EqMake', 'EqModel', 'EqSN'],
        has_truck_info: false,
        title: ['EqYear', 'EqMake', 'EqModel'],
        details: [],
        unit: {},
    }
];



var Common_field_array = [
    {
        name: 'Auction',
        deal_area_element : ['StartDate', 'EndDate'],
        location_area_element : ['Country', 'State', 'City'],
        price_element: ['Price', 'Shipping', 'Customs', 'Commission', 'BuyPremium'],
    },
    {
        name: 'For Sale',
        deal_area_element : ['Contact', 'ContactPhone', 'CompanyName'],
        location_area_element : ['Country', 'State', 'City'],
        price_element: ['Price', 'Shipping', 'Customs', 'Commission', 'Margin'],
    },
    {
        name: 'Consignment',
        deal_area_element : ['Contact', 'ContactPhone', 'CompanyName'],
        location_area_element : ['Country', 'State', 'City'],
        price_element: ['Price', 'Commission', 'Margin'],
    },
    {
        name: 'Inventory',
        deal_area_element : [],
        location_area_element : [],
        price_element: ['Price', 'Margin'],
    }
];


function setTitleIntoInput(catagory) {

    var item = null;

    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];
        if (element.category == catagory) {
            item = element;
        }
    }

    if (item) {
        var titleItemArray = item.title;
        var titleUnitObject = item.unit;
        var titleStr = '';

        for (var i = 0; i < titleItemArray.length; i++) {
            titleStr += $('#' + titleItemArray[i]).val();

            var unit = titleUnitObject[titleItemArray[i]];
            if (unit) {
                titleStr += unit;
            } else {
                titleStr += " ";
            }

        }

        $('#mkTitle').val(titleStr);
    }

}


function getTitleFromDatabase(data) {

    var item = null;

    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];

        if (element.category == data['EqCategory']) {
            item = element;
        }
    }

    var titleStr = '';

    if (item) {
        var titleItemArray = item.title;
        var titleUnitObject = item.unit;


        for (var i = 0; i < titleItemArray.length; i++) {

            if (data[titleItemArray[i]] && data[titleItemArray[i]] != '0') {
                titleStr += data[titleItemArray[i]];
            }

            var unit = titleUnitObject[titleItemArray[i]];
            if (unit) {
                titleStr += ' ';
                titleStr += unit;
            } else {
                titleStr += " ";
            }

        }

    }

    return titleStr;
}

function get_detail_data_for_deal(data) {
    var detail_list = [];

    var item = null;

    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];
        if (element.category == data['EqCategory']) {
            item = element;
        }
    }

    var contentItem = '';
    if (item) {
        var detailItemArray = item.details;
        var detailUnitObject = item.unit;

        var translate_category = get_translated_word(data.EqCategory);
        if (translate_category && data.EqCategory != 'Other') {
            detail_list.push(translate_category);            
        } else if( data.EqCategory == 'Other'){
            detail_list.push("Llámanos para más información");            
        }


        for (var i = 0; i < detailItemArray.length; i++) {
            var str;
            if (detailItemArray[i] == 'Engine') {
                if (data['Engine']) {
                    str = 'Motor: ' + data['Engine'];
                } else {
                    str = '';
                }
            } else if (detailItemArray[i] == 'TruckTrans') {
                if (data['TruckTrans']) {
                    str = 'Trans: ' + data['TruckTrans'];
                } else {
                    str = '';
                }
            } else if (detailItemArray[i] == 'Suspension') {
                if (data['Suspension']) {
                    str = 'Susp: ' + data['Suspension'];
                } else {
                    str = '';
                }
            } else if (detailItemArray[i] == 'Ripper') {
                if (data['Ripper'] == 2) {
                    str = 'Ripper';
                } else {
                    str = '';
                }
            } else if (detailItemArray[i] == 'AuxHyd') {
                if (data['AuxHyd'] == 2) {
                    str = "Kit para martillo";
                } else {
                    str = '';
                }
            } else if (detailItemArray[i] == '4WD') {
                if (data['4WD'] == 2) {
                    str = "4x4";
                } else {
                    str = '4x2';
                }
            } else if (detailItemArray[i] == 'Ext') {
                if (data['Ext'] == 2) {
                    str = 'Ext';
                } else {
                    str = '';
                }
            } else if (detailItemArray[i] == 'Length') {
                if (parseInt(data['Length'])) {
                    str = 'Alcance: ' + data['Length'];
                } else {
                    str = '';
                }

            } else if (detailItemArray[i] == 'Hours') {
                if (parseInt(data['Hours'])) {
                    str = data['Hours'];
                } else {
                    str = '';
                }

            } else if (detailItemArray[i] == 'Type') {
                if (data['Type']) {
                    str = get_translated_word(data['Type']);
                } else {
                    str = '';
                }

            } else {
                if (parseInt(data[detailItemArray[i]]) == 0 | data[detailItemArray[i]] == '') {
                    str = '';
                } else {
                    str = data[detailItemArray[i]];
                }

            }

            var unit = detailUnitObject[detailItemArray[i]];

            if (str) {

                if (unit) {
                    str += " " + unit;
                } else {
                    str += "";
                }

                detail_list.push(str);
            }
        }

    }

    return detail_list;
}


function get_detail_data_for_pdf(data) {
    var contentItem = "";

    var detail_list = get_detail_data_for_deal(data);

    for (var i = 0; i < detail_list.length; i++) {
        contentItem += "<div class='pdf-description-item'><span class='item-content'><div class='item-arrow'></div>" + detail_list[i] + '</span></div>';
    }

    contentItem += "<div class='pdf-description-item'><span class='item-content'><div class='item-arrow'></div>" + data.DealID + '</span></div>';

    return contentItem;    
}

function get_detail_data_for_maquinaria(data) {
    var content = "";
    var detail_list = get_detail_data_for_deal(data);

    for (var i = 1; i < detail_list.length; i++) {
        content += " - " + detail_list[i] + '<br>';
    }

    return content;
}

function get_special_field(category) {
    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];
        if (element.category == category) {
            return element.special_fields;
        }
    }
}

function get_translated_word(word) {
    for (var i = 0; i < Tranlate_word_array.length; i++) {
        var element = Tranlate_word_array[i];
        if (element.english == word) {
            return element.spanish;
        }
    }
    return word;
}

function getTranslatedEquipmentCategory(word) {
    var low_word = word.toLowerCase();
    for (var i = 0; i < Tranlate_word_array.length; i++) {
        var element = Tranlate_word_array[i];
        var eqCategory = element[lang].toLowerCase();
        if (eqCategory == low_word)
            return element.english;
    }

    return word;
}


function has_truck_special_field(category) {
    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];
        if (element.category == category) {
            return element.has_truck_info;
        }
    }
}

function has_equipment_special_field(category) {
    var len = Special_field_array.length;
    for (var i = 0; i < len; i++) {
        var element = Special_field_array[i];
        if (element.category == category) {
            return element.has_equipment_info;
        }
    }
}



$.fn.inputFilter = function (inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
        if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
            this.value = "";
        }
    });
};

function set_special_fields_value_from_scrapdata(result) {

    var data = JSON.parse(result);

    var TruckYear = data['TruckYear'] ? data['TruckYear'] : '';
    if ($('#TruckYear').length) {
        $('#TruckYear').val(TruckYear);
    }

    var TruckMake = data['TruckMake'] ? data['TruckMake'] : '';
    if ($('#TruckMake').length) {
        $('#TruckMake').val(TruckMake);
    }

    var TruckCondition = data['TruckCondition'] ? data['TruckCondition'] : '';
    if ($('#TruckCondition').length) {
        $('#TruckCondition').val(TruckCondition);
    }

    var TruckModel = data['TruckModel'] ? data['TruckModel'] : '';
    if ($('#TruckModel').length) {
        $('#TruckModel').val(TruckModel);
    }

    var Engine = data['Engine'] ? data['Engine'] : '';
    if ($('#Engine').length) {
        $('#Engine').val(Engine);
    }

    var TruckTrans = data['TruckTrans'] ? data['TruckTrans'] : '';
    if ($('#TruckTrans').length) {
        $('#TruckTrans').val(TruckTrans);
    }

    var Length = data['Length'] ? data['Length'] : '';
    if ($('#Length').length) {
        $('#Length').val(Length);
    }

    var Capacity = data['Capacity'] ? data['Capacity'] : '';
    if ($('#Capacity').length) {
        $('#Capacity').val(Capacity);
    }

    var Type = data['Type'] ? data['Type'] : '';
    if ($('#Type').length) {
        $('#Type').val(Type);
    }

    var Hours = data['Hours'] ? data['Hours'] : '';
    if ($('#Hours').length) {
        $('#Hours').val(Hours);
    }

    var Cab = data['Cab'] ? 2 : 1;
    if ($('#Cab').length) {
        $('#Cab').val(Cab);
    }

    var Ripper = data['Ripper'] ? 2 : 1;
    if ($('#Ripper').length) {
        $('#Ripper').val(Ripper);
    }

    var Wd = data['4WD'] ? 2 : 1;
    if ($('#4WD').length) {
        $('#4WD').val(Wd);
    }

    var Ext = data['Ext'] ? 2 : 1;
    if ($('#Ext').length) {
        $('#Ext').val(Ext);
    }

    var AuxHyd = data['AuxHyd'] ? 2 : 1;
    if ($('#AuxHyd').length) {
        $('#AuxHyd').val(AuxHyd);
    }
}


function set_preview_value_from_input_element(category) {

    var TruckYear;
    if ($('#TruckYear').length) {
        TruckYear = $('#TruckYear').val();
    }
    if ($('#previewTruckYear').length) {
        $('#previewTruckYear').html(TruckYear);
    }

    var TruckMake;
    if ($('#TruckMake').length) {
        TruckMake = $('#TruckMake').val();
    }
    if ($('#previewTruckMake').length) {
        $('#previewTruckMake').html(TruckMake);
    }

    var Engine
    if ($('#Engine').length) {
        Engine = $('#Engine').val();
    }
    if ($('#previewEngine').length) {
        $('#previewEngine').html(Engine);
    }

    var TruckCondition;
    var TruckCondUnit;
    if ($('#TruckCondition').length) {
        TruckCondition = $('#TruckCondition').val();
        TruckCondUnit = $('#TruckCondUnit').val();
    }
    if ($('#previewTruckCondition').length) {
        $('#previewTruckCondition').html(TruckCondition + ' ' + TruckCondUnit);
    }

    var TruckModel;
    if ($('#TruckModel').length) {
        TruckModel = $('#TruckModel').val();
    }
    if ($('#previewTruckModel').length) {
        $('#previewTruckModel').html(TruckModel);
    }

    var TruckTrans;
    if ($('#TruckTrans').length) {
        TruckTrans = $('#TruckTrans').val();
    }
    if ($('#previewTruckTrans').length) {
        $('#previewTruckTrans').html(TruckTrans);
    }
    
    var Suspension;
    if ($('#Suspension').length) {
        Suspension = $('#Suspension').val();
    }
    if ($('#previewSuspension').length) {
        $('#previewSuspension').html(Suspension);
    }

    var Length;
    var LengthUnit;
    if ($('#Length').length) {
        Length = $('#Length').val();
        LengthUnit = $('#LengthUnit').val();

        Length = Length + ' ' + LengthUnit;
    }
    if ($('#previewLength').length) {
        $('#previewLength').html(Length);
    }

    var Capacity;
    if ($('#Capacity').length) {
        Capacity = $('#Capacity').val();

        var unit = '';
        for (var i = 0 ; i < Special_field_array.length; i++) {
            if (category == Special_field_array[i].category) {
                unit = Special_field_array[i].unit.Capacity;
                break;
            }
        }

        console.log(unit);
        
        Capacity = Capacity + ' ' + unit;
    }
    if ($('#previewCapacity').length) {
        $('#previewCapacity').html(Capacity);
    }

    var Type;
    if ($('#Type').length) {
        Type = $('#Type').val();
    }
    if ($('#previewType').length) {
        $('#previewType').html(getLocalizationWord(Type));
    }

    var Hours;
    if ($('#Hours').length) {
        Hours = $('#Hours').val();
        Hours = Hours + ' Horas';
    }
    if ($('#previewHours').length) {
        $('#previewHours').html(Hours);
    }

    var HorsePower;
    if ($('#HorsePower').length) {
        HorsePower = $('#HorsePower').val();
        HorsePower = HorsePower + ' hp';
    }
    if ($('#previewHorsePower').length) {
        $('#previewHorsePower').html(HorsePower);
    }


    var Cab;
    if ($('#Cab').length) {
        Cab = $('#Cab').val() == 2 ? 'Yes' : 'No';
    }
    if ($('#previewCab').length) {
        $('#previewCab').html(Cab);
    }

    var Ripper;
    if ($('#Ripper').length) {
        Ripper = $('#Ripper').val() == 2 ? 'Yes' : 'No';
    }
    if ($('#previewRipper').length) {
        $('#previewRipper').html(Ripper);
    }

    var Wd;
    if ($('#4WD').length) {
        Wd = $('#4WD').val() == 2 ? 'Yes' : 'No';
    }
    if ($('#preview4WD').length) {
        $('#preview4WD').html(Wd);
    }

    var Ext;
    if ($('#Ext').length) {
        Ext = $('#Ext').val() == 2 ? 'Yes' : 'No';
    }
    if ($('#previewExt').length) {
        $('#previewExt').html(Ext);
    }

    var AuxHyd;
    if ($('#AuxHyd').length) {
        AuxHyd = $('#AuxHyd').val() == 2 ? 'Yes' : 'No';
    }
    if ($('#previewAuxHyd').length) {
        $('#previewAuxHyd').html(AuxHyd);
    }

    $('#previewNote').val($('#Note').val());

}


function get_equip_content_data_for_sale_document(data) {

    var contentItem = '';
    
    if (data.EqYear) {
        contentItem += '<li>' + data.EqYear + '</li>';                
    }

    if (data.EqMake) {
        contentItem += '<li>' + data.EqMake + '</li>';
    }

    if (data.EqModel) {
        contentItem += '<li>' + data.EqModel + '</li>';
    }

    
    if (data.TruckMake )
        contentItem += '<li>' + data.TruckMake + '</li>';
     
    return contentItem;
}





/////////////////////////////////////////////////////////////////////////////
//////////////////// deal type /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function getCheckedValueForDocument(value) {
    if (value == null || value == '')
        return '';
    return "<li>" + value + '</li>';
}

// For todays date;
Date.prototype.today = function () { 
    return this.getFullYear() + "-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-" + ((this.getDate() < 10)?"0":"") + this.getDate();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
}

function get_location_area_elements(dealType) {

    if (dealType == 'Inventory') 
        $('#LocationAreaHeader').hide();
    else
        $('#LocationAreaHeader').show();

    for (var i = 0; i < Common_field_array.length; i++) {
        if (dealType == Common_field_array[i].name) {
            var input_array = Common_field_array[i].location_area_element;

            var result = '';

            for (item of input_array) {
                if (item == 'Country') {
                    result += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Country') + '</label>' +
                        '<select class="form-control" id="Country"  name="Country"  onchange="onCountryChange(this)" required>' +
                        get_country_options_elements() +
                        '</select>' +
                        '</div>' +
                        '</div>';
                }
                if (item == 'State') {
                    result += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('State') + '</label>' +
                        '<select class="form-control" id="State"  name="State" required>' +
                        get_state_options_elements('USA') +
                        '</select>' +
                        '</div>' +
                        '</div>';
                }
                if (item == 'City') {
                    result += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('City') + '</label>' +
                        '<input type="text" class="form-control" id="City" maxlength="25" name="City">' +
                        '</div>' +
                        '</div>';
                }         
            }
            return result;
        }
    }
}

function get_location_area_preview_elements(dealType) {

    if (dealType == 'Inventory') 
        $('#PreviewLocationAreaHeader').hide();
    else
        $('#PreviewLocationAreaHeader').show();

    for (var i = 0; i < Common_field_array.length; i++) {
        if (dealType == Common_field_array[i].name) {
            var input_array = Common_field_array[i].location_area_element;

            var result = '';

            for (item of input_array) {     
                if (item == 'Country') {
                    result += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Location') + ' : </span><br><span class="preview" id="previewLocation"></span>' +
                        '</div>';
                }             
            }
            return result;
        }
    }
}


function get_deal_area_elements(dealtype) {

    if (dealtype == 'Inventory') 
        $('#DealAreaHeader').hide();
    else
        $('#DealAreaHeader').show();

    for (var i = 0; i < Common_field_array.length; i++) {
        if (dealtype == Common_field_array[i].name) {
            var input_array = Common_field_array[i].deal_area_element;
            var result = '';
            for (item of input_array) {

                if (item == 'StartDate') {
                    result += '<div class="col-lg-4 col-md-12" id="StartDate-input-box">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Start Date') + '</label>' +
                        '<input data-provide="datepicker" data-date-autoclose="true" class="form-control" data-date-format="yyyy-mm-dd" id="StartDate" name="StartDate" required>' +
                        '</div>' +
                        '</div>';
                }
                if (item == 'EndDate') {
                    result += '<div class="col-lg-4 col-md-12" id="EndDate-input-box">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('End Date') + '</label>' +
                        '<input data-provide="datepicker" data-date-autoclose="true" class="form-control" data-date-format="yyyy-mm-dd" id="EndDate" name="EndDate" required>' +
                        '</div>' +
                        '</div>';
                }

                if (item == 'Contact') {
                    result += '<div class="col-lg-4 col-md-12" id="contact-input-box">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Contact') + '</label>' +
                        '<input type="text" class="form-control" id="Contact" maxlength="40" name="Contact">' +
                        '<input type="hidden" id="FullContactPhone" name="FullContactPhone">' +
                        '</div>' +
                        '</div>';
                }
                if (item == 'ContactPhone') {
                    result += '<div class="col-lg-4 col-md-12" id="contactPhone-input-box">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Phone') + '</label>' +
                        '<input type="text" class="form-control" id="ContactPhone" maxlength="25" name="ContactPhone">' +                         
                        '</div>' +
                        '</div>';
                }  
                if (item == 'CompanyName') {
                    result += '<div class="col-lg-4 col-md-12" id="CompanyName-input-box">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Company') + '</label>' +
                        '<input type="text" class="form-control" id="CompanyName" maxlength="25" name="CompanyName">' +                         
                        '</div>' +
                        '</div>';
                }                      
            }
            return result;
        }
    }
}

function get_deal_area_preview_elements(dealtype) {
    if (dealtype == 'Inventory') 
        $('#PreviewDealAreaHeader').hide();
    else
        $('#PreviewDealAreaHeader').show();

    for (var i = 0; i < Common_field_array.length; i++) {
        if (dealtype == Common_field_array[i].name) {
            var input_array = Common_field_array[i].deal_area_element;
            var result = '';
            for (item of input_array) {
                if (item == 'StartDate') {
                    result += '<div class="form-group" id="preview-StartDate-box">' +
                        '<span>' + getLocalizationWord('Start Date') + ' : </span><br><span class="preview" id="previewStartDate"></span>' +
                        '</div>';
                }
                if (item == 'EndDate') {
                    result += '<div class="form-group" id="preview-EndDate-box">' +
                        '<span>' + getLocalizationWord('End Date') + ' : </span><br><span class="preview" id="previewEndDate"></span>' +
                        '</div>';
                }
                if (item == 'Contact') {
                    result += '<div class="form-group" id="preview-Contact-box">' +
                        '<span>' + getLocalizationWord('Contact') + ' : </span><br><span class="preview" id="previewContact"></span>' +
                        '</div>';
                }
                if (item == 'ContactPhone') {
                    result += '<div class="form-group" id="preview-ContactPhone-box">' +
                        '<span>' + getLocalizationWord('Contact Phone') + ' : </span><br><span class="preview" id="previewContactPhone"></span>' +
                        '</div>';
                }
                if (item == 'CompanyName') {
                    result += '<div class="form-group" id="preview-CompanyName-box">' +
                        '<span>' + getLocalizationWord('Company Name') + ' : </span><br><span class="preview" id="previewCompanyName"></span>' +
                        '</div>';
                }
            }
            return result;
        }
    }
}

function get_equipment_area_elements(category) {
    
    for (var i = 0; i < Special_field_array.length; i++) {
        if (category == Special_field_array[i].category) {
            var input_field = Special_field_array[i].equip_info_fields;
            
            var contentElement = '';

            if ($('#inputDealType').val() == 'Inventory') {
                contentElement += '<div class="col-lg-4 col-md-12">' +
                    '<div class="form-group">' +
                    '<label>' + getLocalizationWord('Warehouse') + '</label>' +
                    '<select  class="form-control" id="Warehouse"  name="Warehouse">' +
                    ' <option value="SLRC">SLRC</option>' +
                    ' <option value="Mexicali">Mexicali</option>' +
                    ' <option value="SLAZ">SLAZ</option>' +
                    ' <option value="Calexico">Calexico</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>';
            }

            for (field of input_field) {
                if (field == 'EqYear') {
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Equipment Year') + '</label>' +
                        '<input class="form-control" id="EqYear" name="EqYear" >' +
                        '</div>' +
                        '</div>';
                }
                if (field == 'EqMake') {
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Equipment Manufacturer') + '</label>' +
                        '<input type="text" class="form-control" id="EqMake" name="EqMake" maxlength="25" required >' +
                        '</div>' +
                        '</div>';
                }
                if (field == 'EqModel') {
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Equipment Model') + '</label>' +
                        '<input type="text" class="form-control" id="EqModel" name="EqModel" maxlength="25" >' +
                        '</div>' +
                        '</div>';
                }
                if (field == 'EqSN') {
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Equipment SN') + '</label>' +
                        '<input type="text" class="form-control" maxlength="25" id="EqSN" name="EqSN">' +
                        '</div>' +
                        '</div>';
                }
                if (field == 'Capacity') {   /// add unit   concrete-> meter,
                    var unit = Special_field_array[i].unit.Capacity;
                    var label = getLocalizationWord('Capacity') + '[' + unit + ']';                    
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + label + '</label>' +
                        '<input  class="form-control" id="Capacity" name="Capacity">' +
                        '</div>' +
                        '</div>';
                }
                if (field == 'Length') {
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label style="display:block;">' + getLocalizationWord('Length') + '</label>' +
                        '<div class="unit-box"><input  class="form-control has-unit" id="Length" name="Length">' +
                        '<select class="form-control unit-select" id="LengthUnit" name="LengthUnit">'+
                        ' <option value="ft">ft</option>' +
                        ' <option value="m">m</option>' +
                        ' <option value="in">in</option>' +
                        '</select></div>'+
                        '</div>' +
                        '</div>';
                }
                if (field == 'Type') {
                    if (category == 'Dozer') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + '</label>' +
                            ' <select class="form-control" id="Type" name="Type">' +
                            ' <option value="Wheel">' + getLocalizationWord('Wheel') + '</option>' +
                            ' <option value="Crawler">' + getLocalizationWord('Crawler') + '</option>' +
                            ' </select>' +
                            '</div>' +
                            '</div>';
        
                    } else if (category == 'Generator') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + 'Type</label>' +
                            '  <select class="form-control" id="Type" name="Type">' +
                            '   <option value="Diesel">' + getLocalizationWord('Diesel') + '</option>' +
                            '   <option value="Gas">' + getLocalizationWord('Gas') + '</option>' +
                            '  </select>' +
                            '</div>' +
                            '</div>';
                    } else if (category == 'Lift') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + 'Type</label>' +
                            ' <select class="form-control" id="Type" name="Type">' +
                            ' <option value="Articulated">' + getLocalizationWord('Articulated') + '</option>' +
                            ' <option value="Telescopic">' + getLocalizationWord('Telescopic') + '</option>' +
                            ' <option value="Scissor">' + getLocalizationWord('Scissor') + '</option>' +
                            ' <option value="Pneumatic">' + getLocalizationWord('Pneumatic') + '</option>' +
                            ' <option value="Towable">' + getLocalizationWord('Towable') + '</option>' +
                            ' </select>' +
                            ' </div>' +
                            '</div>';
                    } else if (category == 'Skid Steer') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + 'Type</label>' +
                            '  <select class="form-control" id="Type" name="Type">' +
                            '   <option value="Wheel">' + getLocalizationWord('Wheel') + '</option>' +
                            '   <option value="Crawler">' + getLocalizationWord('Crawler') + '</option>' +
                            '  </select>' +
                            '</div>' +
                            '</div>';
                    } else if (category == 'Dump Truck') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + '</label>' +
                            '  <select class="form-control" id="Type" name="Type">' +
                            '   <option value="7m">7m</option>' +
                            '   <option value="14m">14m</option>' +
                            '  </select>' +
                            '</div>' +
                            '</div>';
                    } else if (category == 'Garbage Truck') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + '</label>' +
                            '  <select class="form-control" id="Type" name="Type">' +
                            '   <option value="Front">' + getLocalizationWord('Front') + '</option>' +
                            '   <option value="Grapple">' + getLocalizationWord('Grapple') + '</option>' +
                            '   <option value="Other">' + getLocalizationWord('Other') + '</option>' +
                            '  </select>' +
                            '</div>' +
                            '</div>';
                    } else if (category == 'Unmounted Boom') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + '</label>' +
                            '  <select class="form-control" id="Type" name="Type">' +
                            '   <option value="Boom">' + getLocalizationWord('Boom') + '</option>' +
                            '   <option value="Articulated">' + getLocalizationWord('Articulated') + '</option>' +
                            '  </select>' +
                            '</div>' +
                            '</div>';
                    } else if (category == 'Agriculture') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Type') + '</label>' +
                            '  <select class="form-control" id="Type" name="Type">' +
                            '   <option value="Tractor">' + getLocalizationWord('Tractor') + '</option>' +
                            '   <option value="Grain Drill">' + getLocalizationWord('Grain Drill') + '</option>' +                            
                            '   <option value="Harvester">' + getLocalizationWord('Harvester') + '</option>' +                            
                            '   <option value="Other">' + getLocalizationWord('Other') + '</option>' +
                            '  </select>' +
                            '</div>' +
                            '</div>';
                    } else if (category == 'Accessory' || category == 'Parts' || category == 'Replacements') {
                        contentElement += '<div class="col-lg-4 col-md-12">' +
                            '<div class="form-group">' +
                            '<label>' + getLocalizationWord('Name') + '</label>' +
                            '<input  class="form-control" id="Type" name="Type" required>' +
                            '</div>' +
                            '</div>';                    
                    } else {
                        contentElement += ' <div class="col-lg-4 col-md-12">' +
                            ' <div class="form-group">' +
                            ' <label>' + getLocalizationWord('Boom Type') + '</label>' +
                            ' <select class="form-control" id="Type" name="Type">' +
                            ' <option value="RnF">RnF</option>' +
                            ' <option value="Z">Z</option>' +
                            ' </select>' +
                            ' </div>' +
                            ' </div>';
                    }
        
                }
                if (field == 'Hours') {
                    contentElement += ' <div class="col-lg-4 col-md-12">' +
                        ' <div class="form-group">' +
                        ' <label>' + getLocalizationWord('Hours') + '[' + getLocalizationWord('Hours') + ']</label>' +
                        ' <input class="form-control" type="number" id="Hours" name="Hours">' +
                        ' </div>' +
                        ' </div>';
                }
                if (field == 'HorsePower') {
                    contentElement += ' <div class="col-lg-4 col-md-12">' +
                        ' <div class="form-group">' +
                        ' <label>' + getLocalizationWord('HorsePower') + '[hp]</label>' +
                        ' <input class="form-control" type="number" id="HorsePower" name="HorsePower">' +
                        ' </div>' +
                        ' </div>';
                }
                if (field == 'Cab') {
                    contentElement += ' <div class="col-lg-4 col-md-12">' +
                        ' <div class="form-group">' +
                        ' <label>' + getLocalizationWord('Cabin') + '</label>' +
                        ' <select class="form-control" id="Cab" name="Cab">' +
                        ' <option value="2">' + getLocalizationWord('YES') + '</option>' +
                        ' <option value="1">' + getLocalizationWord('NO') + '</option>' +
                        ' </select>' +
                        ' </div>' +
                        ' </div>';
                }
                if (field == '4WD') {
                    contentElement += ' <div class="col-lg-4 col-md-12">' +
                        '  <div class="form-group">' +
                        '  <label>' + getLocalizationWord('4WD') + '</label>' +
                        '  <select class="form-control" id="4WD" name="4WD">' +
                        '   <option value="2">' + getLocalizationWord('YES') + '</option>' +
                        '   <option value="1">' + getLocalizationWord('NO') + '</option>' +
                        '  </select>' +
                        ' </div>' +
                        '  </div>';
                }
                if (field == 'Ext') {
                    contentElement += ' <div class="col-lg-4 col-md-12">' +
                        ' <div class="form-group">' +
                        ' <label>' + getLocalizationWord('Extendahoe') + '</label>' +
                        ' <select class="form-control" id="Ext" name="Ext">' +
                        ' <option value="2">' + getLocalizationWord('YES') + '</option>' +
                        ' <option value="1">' + getLocalizationWord('NO') + '</option>' +
                        ' </select>' +
                        ' </div>' +
                        ' </div>';
                }
                if (field == 'AuxHyd') {
                    contentElement += ' <div class="col-lg-4 col-md-12">' +
                        ' <div class="form-group">' +
                        ' <label>' + getLocalizationWord('AuxHyd') + '</label>' +
                        '  <select class="form-control" id="AuxHyd" name="AuxHyd">' +
                        ' <option value="2">' + getLocalizationWord('YES') + '</option>' +
                        ' <option value="1">' + getLocalizationWord('NO') + '</option>' +
                        '  </select>' +
                        ' </div>' +
                        ' </div>';
                }
                if (field == 'Ripper') {
                    contentElement += '<div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Ripper') + '</label>' +
                        ' <select class="form-control" id="Ripper" name="Ripper">' +
                        ' <option value="2">' + getLocalizationWord('YES') + '</option>' +
                        ' <option value="1">' + getLocalizationWord('NO') + '</option>' +
                        ' </select>' +
                        '</div>' +
                        '</div>';
                }
            }
            
            return contentElement;
        }
    }
}


function get_equipment_area_preview_elements(category) {
    
    for (var i = 0; i < Special_field_array.length; i++) {
        if (category == Special_field_array[i].category) {
            var input_field = Special_field_array[i].equip_info_fields;
            
            var contentElement = '';

            if ($('#inputDealType').val() == 'Inventory') {
                contentElement += '<div class="form-group" id="preview-Warehouse-box">' +
                        '<span>' + getLocalizationWord('Warehouse') + ' : </span><br><span class="preview" id="previewWarehouse"></span>' +
                        '</div>';
            }

            for (field of input_field) {
                if (field == 'EqYear') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Equipment Year') + ' : </span><br><span class="preview" id="previewEqYear"></span>' +
                        '</div>';
                }
                if (field == 'EqMake') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Equipment Manufacturer') + ' : </span><br><span class="preview" id="previewEqMake"></span>' +
                        '</div>';
                }
                if (field == 'EqModel') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Equipment Model') + ' : </span><br><span class="preview" id="previewEqModel"></span>' +
                        '</div>';
                }
                if (field == 'EqSN') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Equipment SN') + ' : </span><br><span class="preview" id="previewEqSN"></span>' +
                        '</div>';
                }
                if (field == 'Capacity') {   /// add unit   concrete-> meter,
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Capacity') + ' : </span><br><span class="preview" id="previewCapacity"></span>' +
                        '</div>';
                }
                if (field == 'Length') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Length') + ' : </span><br><span class="preview" id="previewLength"></span>' +
                        '</div>';
                }
                if (field == 'Type') {
        
                    if (category == 'Accessory' || category == 'Parts' || category == 'Replacements')
                    {
                        contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Name') + ' : </span><br><span class="preview" id="previewType"></span>' +
                        '</div>';
                    }                    
                    else {
                        contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Boom Type') + ' : </span><br><span class="preview" id="previewType"></span>' +
                        '</div>';
                    }
                    
                }
                if (field == 'Hours') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Hours') + 'Hours : </span><br><span class="preview" id="previewHours"></span>' +
                        '</div>';
                }
                if (field == 'HorsePower') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('HorsePower') + ' : </span><br><span class="preview" id="previewHorsePower"></span>' +
                        '</div>';
                }
                if (field == 'Cab') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Cabin') + ' : </span><br><span class="preview" id="previewCab"></span>' +
                        '</div>';
                }
                if (field == '4WD') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('4WD') + ' : </span><br><span class="preview" id="preview4WD"></span>' +
                        '</div>';
                }
                if (field == 'Ext') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Extendahoe') + ' : </span><br><span class="preview" id="previewExt"></span>' +
                        '</div>';
                }
                if (field == '') {
                    contentElement += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('AuxHyd') + ' : </span><br><span class="preview" id="previewAuxHyd"></span>' +
                        '</div>';
                }
                if (field == 'Ripper') {
                    contentElement += ' <div class="form-group">' +
                        '  <span>' + getLocalizationWord('Ripper') + ' : </span><br><span class="preview" id="previewRipper"></span>' +
                        ' </div>';
                }
            }
            
            return contentElement;
        }
    }
}

function get_truck_area_elements(category) {
    var has_truck_info = has_truck_special_field(category); 

    if (has_truck_info == false) {
        $('#TruckAreaHeader').hide();
        return "";
    }
    
    $('#TruckAreaHeader').show();    

    var contentElement = '';
    special_field_array = ['TruckYear', 'TruckMake', 'TruckModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'];
    for (field of special_field_array) {
        if (field == 'TruckYear') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                ' <div class="form-group">' +
                '<label>' + getLocalizationWord('Truck Year') + '</label>' +
                '<input  class="form-control" id="TruckYear" name="TruckYear" required>' +
                '</div>' +
                '</div>';
        }
        if (field == 'TruckMake') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Truck Manufacturer') + '</label>' +
                '<input type="text" class="form-control" maxlength="25" id="TruckMake" name="TruckMake" required>' +
                '</div>' +
                '</div>';
        }
        if (field == 'TruckModel') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Truck Model') + '</label>' +
                '<input type="text" class="form-control" maxlength="20" id="TruckModel" name="TruckModel">' +
                '</div>' +
                '</div>';
        }
        if (field == 'Engine') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Engine') + '</label>' +
                '<input type="text" class="form-control" maxlength="25" id="Engine" name="Engine">' +
                '</div>' +
                '</div>';
        }
        if (field == 'TruckCondition') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Condition') + ' [mi/km]</label>' +
                '<div class="unit-box"><input type="number" class="form-control has-unit" maxlength="25" id="TruckCondition" name="TruckCondition">' +
                '<select class="form-control unit-select" id="TruckCondUnit" name="TruckCondUnit">'+
                ' <option value="mi">mi</option>' +
                ' <option value="km">km</option>' +
                '</select></div>'+
                '</div>' +
                '</div>';
        }
        if (field == 'TruckTrans') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Transmission') + '</label>' +
                '<input type="text" class="form-control" maxlength="25" id="TruckTrans" name="TruckTrans">' +
                '</div>' +
                '</div>';
        }   
        if (field == 'Suspension') {
            contentElement += '<div class="col-lg-4 col-md-12">' +
                '<div class="form-group">' +
                '<label>' + getLocalizationWord('Suspension') + '</label>' +
                '<input type="text" class="form-control" maxlength="25" id="Suspension" name="Suspension">' +
                '</div>' +
                '</div>';
        }         
    }

    return contentElement;
}

function get_truck_area_preview_elements(category) {
    var has_truck_info = has_truck_special_field(category); 

    if (has_truck_info == false) {
        $('#PreviewTruckAreaHeader').hide();
        return "";
    }

    $('#PreviewTruckAreaHeader').show();

    var contentElement = '';
    special_field_array = ['TruckYear', 'TruckMake', 'TruckModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'];
    for (field of special_field_array) {
        if (field == 'TruckYear') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Truck Year') + ' : </span><br><span class="preview" id="previewTruckYear"></span>' +
                '</div>';
        }
        if (field == 'TruckMake') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Truck Manufacturer') + ' : </span><br><span class="preview" id="previewTruckMake"></span>' +
                '</div>';
        }
        if (field == 'TruckModel') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Truck Model') + ' : </span><br><span class="preview" id="previewTruckModel"></span>' +
                '</div>';
        }
        if (field == 'Engine') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Engine') + ' : </span><br><span class="preview" id="previewEngine"></span>' +
                '</div>';
        }
        if (field == 'TruckCondition') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Condition') + ' : </span><br><span class="preview" id="previewTruckCondition"></span>' +
                '</div>';
        }
        if (field == 'TruckTrans') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Transmission') + ' : </span><br><span class="preview" id="previewTruckTrans"></span>' +
                '</div>';
        }
        if (field == 'Suspension') {
            contentElement += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Suspension') + ' : </span><br><span class="preview" id="previewSuspension"></span>' +
                '</div>';
        }           
    }

    return contentElement;
}

function get_add_price_element(dealtype) {
    
    for (var i = 0; i < Common_field_array.length; i++) {
        if (dealtype == Common_field_array[i].name) {
            var price_array = Common_field_array[i].price_element;
            var result = '';
            for (item of price_array) {

                if (item == 'Price') {
                    result += '  <div class="col-lg-4 col-md-12">' +
                        '<div class="form-group">' +
                        '<label>' + getLocalizationWord('Price') + '</label>' +
                        '<input type="number" class="form-control" id="Price" name="Price" onchange="Calculate();" value="0" onkeyup="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();" required>' +
                        '</div>' +
                        '</div>';
                }
            }
            
            return result;
        }
    }
}

function get_add_price_preview_element(dealtype) {
    for (var i = 0; i <= Common_field_array.length; i++) {
        if (dealtype == Common_field_array[i].name) {
            var price_array = Common_field_array[i].price_element;
            var result = '';
            for (item of price_array) {

                if (item == 'Price') {
                    result += '<div class="form-group">' +
                        '<span >' + getLocalizationWord('Price') + ': </span><br><span class="preview" id="previewPrice"></span>' +
                        '</div>';
                }
                if (item == 'Shipping') {
                    result += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Shipping') + ' : </span><br><span class="preview" id="previewShipping"></span>' +
                        '</div>';
                }

                if (item == 'Customs') {
                    result += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Customs') + ' : </span><br><span class="preview" id="previewCustoms"></span>' +
                        '</div>';
                }
                if (item == 'Commission') {
                    result += '<div class="form-group">' +
                        '<span>' + getLocalizationWord('Commission') + ' : </span><br><span class="preview" id="previewCommission"></span>' +
                        '</div>';
                }
                if (item == 'BuyPremium') {
                    result += '<div class="form-group">' +
                        '<span>' + getLocalizationWord("Buyer's Premium") + ' : </span><br><span class="preview" id="previewBuyPremium"></span>' +
                        '</div>';
                }
                if (item == 'Margin') {
                    result += '<div class="form-group">' +
                        '<span>' + getLocalizationWord("Margin") + ' : </span><br><span class="preview" id="previewMargin"></span>' +
                        '</div>';
                }

            }

            result += '<div class="form-group">' +
                '<span>' + getLocalizationWord('Total') + ' : </span><br><span class="preview" id="previewTotal"></span>' +
                '</div>';
            return result;
        }
    }
}

function set_preview_common_value_from_input_element() {

    $('#previewPrimaryImage').attr('src', $('#primaryImageUrl').val());

    var EqYear;
    if ($('#EqYear').length) {
        EqYear = $('#EqYear').val();
    }
    if ($('#previewEqYear').length) {
        $('#previewEqYear').html(EqYear);
    }

    var EqMake;
    if ($('#EqMake').length) {
        EqMake = $('#EqMake').val();
    }
    if ($('#previewEqMake').length) {
        $('#previewEqMake').html(EqMake);
    }

    var EqModel;
    if ($('#EqModel').length) {
        EqModel = $('#EqModel').val();
    }
    if ($('#previewEqModel').length) {
        $('#previewEqModel').html(EqModel);
    }

    var EqSN;
    if ($('#EqSN').length) {
        EqSN = $('#EqSN').val();
    }
    if ($('#previewEqSN').length) {
        $('#previewEqSN').html(EqSN);
    }

    var StartDate;
    if ($('#StartDate').length) {
        StartDate = $('#StartDate').val();
    }
    if ($('#previewStartDate').length) {
        $('#previewStartDate').html(StartDate);
    }

    var EndDate;
    if ($('#EndDate').length) {
        EndDate = $('#EndDate').val();
    }
    if ($('#previewEndDate').length) {
        $('#previewEndDate').html(EndDate);
    }

    var Total;
    if ($('#Total').length) {
        Total = $('#Total').val();
    }
    if ($('#previewTotal').length) {
        $('#previewTotal').html(numberWithCommas(Total));
    }

    var Shipping;
    if ($('#Shipping').length) {
        Shipping = $('#Shipping').val();
    }
    if ($('#previewShipping').length) {
        $('#previewShipping').html(Shipping);
    }

    var Customs;
    if ($('#Customs').length) {
        Customs = $('#Customs').val();
    }
    if ($('#previewCustoms').length) {
        $('#previewCustoms').html(Customs);
    }

    var Commission;
    if ($('#Commission').length) {
        Commission = $('#Commission').val();
    }
    if ($('#previewCommission').length) {
        $('#previewCommission').html(Commission);
    }

    var Price;
    if ($('#Price').length) {
        Price = $('#Price').val();
    }
    if ($('#previewPrice').length) {
        $('#previewPrice').html(Price);
    }

    var BuyPremium;
    if ($('#BuyPremium').length) {
        BuyPremium = $('#BuyPremium').val();
    }
    if ($('#previewBuyPremium').length) {
        $('#previewBuyPremium').html(BuyPremium);
    }

    var Country;
    if ($('#Country').length) {
        Country = $('#Country').val();
    }

    var State;
    if ($('#State').length) {
        State = $('#State').val();
        State += ', ';
    }

    var City;
    if ($('#City').length) {
        City = $('#City').val();
        if (City && City != '') {
            City += ', ';
        }
    }

    if ($('#previewLocation').length) {
        $('#previewLocation').html(City + State + Country);
    }

    var Contact;
    if ($('#Contact').length) {
        Contact = $('#Contact').val();
    }
    if ($('#previewContact').length) {
        $('#previewContact').html(Contact);
    }

    var ContactPhone;
    if ($('#ContactPhone').length) {
        ContactPhone = $('#ContactPhone').intlTelInput('getNumber');
        $('#FullContactPhone').val(ContactPhone);
    }
    if ($('#previewContactPhone').length) {
        $('#previewContactPhone').html(ContactPhone);
    }

    var CompanyName;
    if ($('#CompanyName').length) {
        CompanyName = $('#CompanyName').val();
    }
    if ($('#previewCompanyName').length) {
        $('#previewCompanyName').html(CompanyName);
    } 

    var Margin;
    if ($('#Margin').length) {
        Margin = $('#Margin').val();
    }
    if ($('#previewMargin').length) {
        $('#previewMargin').html(Margin);
    }

    var Warehouse;
    if ($('#Warehouse').length) {
        Warehouse = $('#Warehouse').val();
    }
    if ($('#previewWarehouse').length) {
        $('#previewWarehouse').html(Warehouse);
    }
}


function set_common_value_from_scrapdata(result) {

    var data = JSON.parse(result);

    $('#slide1').attr('src', data["PrimaryImage"][0]);
    $('#slide2').attr('src', data["PrimaryImage"][1]);
    $('#slide3').attr('src', data["PrimaryImage"][2]);    

    $('#scrappedImage1').val(data['PrimaryImage'][0]);
    $('#scrappedImage2').val(data['PrimaryImage'][1]);
    $('#scrappedImage3').val(data['PrimaryImage'][2]);    

    if ($('#StartDate').length) {

        var StartDate = data['StartDate'] ? data['StartDate'] : '';
        if (StartDate) {

            var sDate = new Date(StartDate);
            var eDate = new Date(StartDate);

            $('#StartDate').datepicker('setDate', sDate);
            $('#StartDate').datepicker('setStartDate', sDate);

            if (data['EndDate']) {
                $('#EndDate').datepicker('setDate', eDate);
                $('#EndDate').datepicker('setStartDate', eDate);
            } else {
                $('#EndDate').datepicker('setDate', sDate);
                $('#EndDate').datepicker('setStartDate', sDate);
            }

        } else {

            var sDate = new Date();
            $('#StartDate').datepicker('setDate', sDate);
            $('#EndDate').datepicker('setDate', sDate);

        }
    }

    var location = data['Location'];
    var locationArray = location.split(",");
    var city = '';
    var state = '';
    var country = '';
    if (locationArray.length > 0)
        city = locationArray[0].trim();
    if (locationArray.length > 1)
        state = locationArray[1].trim();
    if (locationArray.length > 2)
        country = locationArray[2].trim();

    if ($('#Country').length) {
        set_country_value(country);
    }
    if ($('#State').length) {
        set_state_value(state);
    }
    if ($('#City').length) {
        $('#City').val(city);
    }

    var EqYear = data['EqYear'] ? data['EqYear'] : '';
    if ($('#EqYear').length) {
        $('#EqYear').val(EqYear);
    }

    var EqModel = data['EqModel'] ? data['EqModel'] : '';
    if ($('#EqModel').length) {
        $('#EqModel').val(EqModel);
    }

    var EqMake = data['EqMake'] ? data['EqMake'] : '';
    if ($('#EqMake').length) {
        $('#EqMake').val(EqMake);
    }
    var EqSN = data['EqSN'] ? data['EqSN'] : '';
    if ($('#EqSN').length) {
        $('#EqSN').val(EqSN);
    }

    var mkTitle = EqYear + EqModel + EqMake;
    if ($('#mkTitle').length) {
        $('#mkTitle').val(mkTitle);
    }

    if ($('#mkDescription').length) {
        $('#mkDescription').val('');
    }

    var Warehouse = data['Warehouse'] ? data['Warehouse'] : '';
    if ($('#Warehouse').length) {
        $('#Warehouse').val(Warehouse);
    }

    $('#Total').val(2500);

}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


function get_state_options_elements(country) {

    var USACountryArray = ['USA', 'usa', 'America', 'AMERICA'];
    var MexicoCountryArray = ['Mexico', 'MEXICO', 'Mex', 'MEX'];
    var CanandaCountryArray = ['CANADA', 'Canada', 'CAN'];

    var states = [];

    if (USACountryArray.includes(country)) {
        var location = Locations[0];
        states = location.state;

    } else if (MexicoCountryArray.includes(country)) {
        var location = Locations[1];
        states = location.state;
    } else if (CanandaCountryArray.includes(country)) {
        var location = Locations[2];
        states = location.state;
    } else {
        states = [];
    }

    var optionGroup = '<option value=""></option>';

    for (state of states) {
        optionGroup += '<option value="' + state.name + '">' + state.name + '</option>';
    }

    return optionGroup;

}

function get_equipment_category_element() {
    var optionGroup = "";

    for (field of Special_field_array)
    {   
        optionGroup += '<option value="' + field.category + '">' + field.category + '</option>';
    }
    return optionGroup;
}

function get_translated_equipment_category_element() {
    var optionGroup = "";

    var EqCategory = [];

    for (field of Special_field_array)
    {
        if (lang == 'spanish') {
            EqCategory.push(
                {'key' : field.category, 'value' : get_translated_word(field.category)}
            );
        }
        else  {
            EqCategory.push(
                {'key' : field.category, 'value' : field.category}
            );        
        }                
    }
    
    EqCategory.sort(function(a, b) { 
        if (b.value > a.value)
            return -1;
        else if (b.value < a.value)
            return 1;
        else   
            return 0;
    });     

    for (var i = 0; i < EqCategory.length; i++) {
        optionGroup += '<option value="' + EqCategory[i].key + '">' + EqCategory[i].value + '</option>';
    }

    
    return optionGroup;
}

function get_country_options_elements() {
    var optionGroup = '<option value=""></option>';
    optionGroup += '<option value="USA">USA</option>';
    optionGroup += '<option value="Mexico">Mexico</option>';
    optionGroup += '<option value="Canada">Canada</option>';
    return optionGroup;
}

function onCountryChange(element) {
    var country = $(element).val();
    var options = get_state_options_elements(country);
    $('#State').html(options);
}

function get_location_item(country, abbre) {

    var USACountryArray = ['USA', 'usa', 'America', 'AMERICA'];
    var MexicoCountryArray = ['Mexico', 'MEXICO', 'Mex', 'MEX'];
    var CanandaCountryArray = ['CANADA', 'Canada', 'CAN'];

    var states = [];

    if (USACountryArray.includes(country)) {
        var location = Locations[0];
        states = location.state;

    } else if (MexicoCountryArray.includes(country)) {
        var location = Locations[1];
        states = location.state;
    } else if (CanandaCountryArray.includes(country)) {
        var location = Locations[2];
        states = location.state;
    } else {
        states = [];
    }


    var result = { name: '', abbreviation: '' };
    for (state of states) {
        if (state.abbreviation == abbre) {
            result = state;
        }
    }

    return result;
}

function set_state_value(stateAbbre) {

    var country = $('#Country').val();

    if (country) {
        console.log(country);
        var state = get_location_item(country, stateAbbre);
        var options = get_state_options_elements(country);
        $('#State').html(options);
        $('#State').val(state.name);
    } else {
        $('#State').val('');
    }
}

function set_country_value(country) {

    var USACountryArray = ['USA', 'usa', 'America', 'AMERICA'];
    var MexicoCountryArray = ['Mexico', 'MEXICO', 'Mex', 'MEX'];
    var CanandaCountryArray = ['CANADA', 'Canada', 'CAN'];

    if (USACountryArray.includes(country)) {
        $('#Country').val('USA');
    } else if (MexicoCountryArray.includes(country)) {
        $('#Country').val('Mexico');
    } else if (CanandaCountryArray.includes(country)) {
        $('#Country').val('Canada');
    }
}

function getDateStringFromTimestamp(timestamp) {
    var dayStr = '';

    try {
        if (lang == 'english')
            dayStr = 'day';
        else if (lang == 'spanish')
            dayStr = 'día';
    }
    catch(e) {
        if(e.name == 'ReferenceError')
            dayStr = 'day';
    }
    if (timestamp < 0)
        return '00:00:00';

    timestamp = (timestamp / 1000 | 0);
    
    var hours = (timestamp / 3600 | 0);
    var minutes = '0' + (timestamp % 3600 / 60 | 0);
    var seconds = '0' + (timestamp % 60);
    var days = (hours / 24 | 0);
    var hours = (hours % 24);
    
    var formattedTime = '';
    if (days > 0)  {
        if (days == 1)
            formattedTime = days + ' ' + dayStr + ' ';
        else 
            formattedTime = days + ' ' + dayStr + 's ';
    }
    formattedTime += hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;    
}

function getSecondRemovedDateTime(dateTime) {
    dateTime = dateTime.replace(/-/g, '/');
    dateTime = dateTime.substr(5);
    return dateTime.substr(0, dateTime.length - 3);
}

function getShortDateTime(dateTime) {
    return dateTime.substr(0, 16);
}

function getDatefromDateTime(dateTime) {
    return dateTime.substr(0, 10);
}

function replaceNR2Br(str) {
    str  = str.replace(/(?:\r\n|\r|\n)/g, '<br>');
    str = str.replace(/"/g, "&&%%");
    return str;
}

function restoreSpecificCharacter(str) {    
    str = str.replace(/&&%%/g, '"');
    return str;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numbeWithoutCommas(x) {
    return x.replace(/,/g, '');
}

function getCheckedValue(val, type = '') {
    if (val == null)
        return '';
    if (type == 'mail') {
        var gmail_link = '';
        if(val != '') {
            gmail_link = '<a class="contact-link" href="javascript:void(0);" onclick="SendViaGmail(\'' + val +'\')"><img class="publish-icon" src="/assets/images/publish_icon/Gmail_icon.png"></a>';
            val = getLocalizationWord(val) + gmail_link + '<br>';
        }
    } else {
        val = (val == '') ? val : (getLocalizationWord(val) + '<br>');
    }
    return val;
}

function SendViaWhatsapp(Phone) {
    logSuccessActivity('Whatsapp Click', 0, '');
    var link = encodeURI('https://wa.me/'+ Phone +'?text=Hello');    
    window.open(link);
}

function SendViaGmail(Email) {
    logSuccessActivity('Gmail Click', 0, '');
    var link = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to='+Email;
    window.open(link);
}

var country_codes = [
    '1'
]

function getStyledPhoneNumber(phone) {
    if (phone == null)
        return '';
    
    if (phone.length < 11) {
        var countryCode = phone.substr(0, 3);
        var stateCode = phone.substr(3, 3);
        var cityCode = phone.substr(6, 4);
        return countryCode + ' ' + stateCode + ' ' + cityCode;
    }

    var index = 0;
    for (index = 0; index < countryCodes.length; index++) {
        var countryCode = countryCodes[index].countryCode;
        var code_length = countryCode.length;

        var phone_code = phone.substr(1, code_length);

        if (phone_code == countryCode)
            break;
    }

    if (index == countryCodes.length)
        return phone;

    var countryCodeLength = countryCodes[index].countryCodeLength;
    var areaCodeLength = countryCodes[index].areaCodeLength;
    var cityCodeLength = countryCodes[index].cityCodeLength;
    var personCodeLength = countryCodes[index].personCodeLength;

    var country = phone.substr(0, countryCodeLength);
    var area = phone.substr(countryCodeLength, areaCodeLength);
    var city = phone.substr(countryCodeLength + areaCodeLength, cityCodeLength);
    var person = phone.substr(countryCodeLength + areaCodeLength + cityCodeLength, personCodeLength);

    return  phoneStyleCode(country) + 
            phoneStyleCode(area) + 
            phoneStyleCode(city) + 
            phoneStyleCode(person);
}

function getStyledPhoneNumberonDocument(phone) {
    if (phone.length < 10)
        return '';
    phone.replace("-", "");
    phone.replace(" ", "");
    var country = phone.substr(0, 3);
    var city = phone.substr(3, 3);
    var person = phone.substr(6, 4);

    return "(" + country + ") " + city + " " + person;
}

function phoneStyleCode(code) {
    if (code == '')
        return '';
    return code + ' ';
}

function getBadgetForEachStatus(status) {
    if (status == 'New' || status == 'Proposal') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + status + '</span>';
    }
    else if (status == 'Pending') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + status + '</span>';
    }
    else if (status == 'Assigned' || status == 'Opportunity' || status == 'Scheduled') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + status + '</span>';
    }
    else if (status == 'Closed' || status == 'Info' || status == 'No Lead') {
        return '<span class="badge badge-default" style="margin-left : 0px;">' + status + '</span>';
    }
    else if (status == 'Canceled' || status == 'No Contact') {
        return '<span class="badge badge-danger" style="margin-left : 0px;">' + status + '</span>';
    }
    else if (status == 'Contact') {
        return '<span class="badge badge-primary" style="margin-left : 0px;">' + status + '</span>';
    }
    else 
        return status;
}

function getBadgetForEachStatusOnMyOpp(status) {
    if (status == 'Proposal' || status == 'Sale') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Pending') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'No Contact') {
        return '<span class="badge badge-danger" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Contact') {
        return '<span class="badge badge-primary" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else 
        return status;
}

function getBadgetForEachStatusOnOpp(status) {
    if (status == 'New') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Pending') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Assigned') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Closed') {
        return '<span class="badge badge-default" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Canceled') {
        return '<span class="badge badge-danger" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
        return status;
}

function getBadgetForEachStatusOnDeal(status) {
    if (status == 'Consignment') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Auction') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'For Sale') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Inventory') {
        return '<span class="badge badge-danger" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
}

function getBadgetForEachStatusOnLead(status) {
    if (status == 'New') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Pending') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Opportunity') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Info' || status == 'No Lead') {
        return '<span class="badge badge-default" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }  
    else if (status == 'No Contact' || status == 'Closed') {
        return '<span class="badge badge-danger" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
}

function getBadgetForEachStatusOnCFU(status) {
    if (status == 'New') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Pending') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Opportunity' || status == 'Scheduled') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Closed') {
        return '<span class="badge badge-default" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }    
}

function getBadgetForEachStatusOnSale(status) {
    if (status == 'Ready') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Pending') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Closed' || status == 'Canceled') {
        return '<span class="badge badge-default" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'Shipping' || status == 'Customs' || status == 'Shop') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }    
    else 
        return status;
}

function getBadgetForDealType(dealType) {
    if (dealType == 'Auction') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(dealType) + '</span>';
    }
    else if (dealType == 'For Sale') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(dealType) + '</span>';
    }
    else if (dealType == 'Consignment') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(dealType) + '</span>';
    }
    else if (dealType == 'Inventory') {
        return '<span class="badge badge-danger" style="margin-left : 0px;">' + getLocalizationWord(dealType) + '</span>';
    }
    else if (dealType == 'Manufacturing') {
        return '<span class="badge" style="margin-left : 0px; color: #6f42c1">' + getLocalizationWord(dealType) + '</span>';
    }
    else if (dealType == 'Logistics') {
        return '<span class="badge badge-default" style="margin-left : 0px;">' + getLocalizationWord(dealType) + '</span>';
    }
}

function getBadgetForEachStatusOnProcurement(status) {
    if (status == 'New') {
        return '<span class="badge badge-success" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }
    else if (status == 'In Progress') {
        return '<span class="badge badge-warning" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }    
    else if (status == 'Paid') {
        return '<span class="badge badge-info" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }    
    else if (status == 'Canceled') {
        return '<span class="badge badge-error" style="margin-left : 0px;">' + getLocalizationWord(status) + '</span>';
    }    
    else 
        return status;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getCustomerData(phone) {
    showSpinner();
    var customer;

    $.ajax({
        url : base_url + 'Customers/getCustomer',
        type : 'post',
        data : {
            Phone : phone
        },
        async: false,
        cache: false,
        timeout: 30000,
        success : function(res) {
            hiddenSpinner();

            var data = JSON.parse(res);

            if (data.success == false)
                customer = null;
            else
                customer = data.customer;            
        }
    });

    return customer;
}
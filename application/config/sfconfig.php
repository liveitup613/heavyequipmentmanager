<?php

return [
    [
        'category' => 'Accessory',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Type'],
        'has_truck_info' => false,
        'title' => ['Type'],
        'details' => ['EqYear', 'EqMake', 'EqModel'],
        'unit' => []
    ],
    [
        'category' => 'Agriculture',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Type', 'Engine', 'HorsePower'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'Type'],
        'details' => ['Type', 'EqModel', 'Engine', 'HorsePower'],
        'unit' => [
            'HorsePower' => 'hp'
        ]
    ],
    [
        'category' => 'Boom Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        'has_truck_info' => true,   // truck_info = truckyear, truckmake, truckmodel, trucktrans, truckcondition, engine
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition', 'Length'],
        'unit' => [ 'Capacity' => 'ton' ]

    ],
    [
        'category' => 'Bucket Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Length'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Length'],
        'details' => ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition'],
        'unit' => [ ]
    ],
    [
        'category' => 'Bus',
        'equip_info_fields' => ['EqSN', 'Capacity'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'pas']
    ],
    [
        'category' => 'Chasis Truck',
        'equip_info_fields' => ['EqSN'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'TruckModel'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ ]
    ],
    [
        'category' => 'Concrete Pump Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Type'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['EqMake', 'EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'm' ]
    ],
    [
        'category' => 'Crane',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'Capacity'],
        'details' => ['EqModel', 'Length'],
        'unit' => [ 'Capacity' => 'ton' ]
    ],
    [
        'category' => 'Digger Derrick Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Length'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'EqModel'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ ]
    ],
    [
        'category' => 'Dozer',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Cab', 'Hours', 'Ripper', 'Type'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', 'Ripper'],
        'unit' => [ 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Dump Truck',
        'equip_info_fields' => ['EqSN', 'Type'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Type'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ ]
    ],
    [
        'category' => 'Excavator',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'AuxHyd', 'Hours', 'Length'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', 'Length', 'AuxHyd'],
        'unit' => [ 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Forklift',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Length', 'Capacity'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', 'Length', 'Capacity'],
        'unit' => [ 'Capacity' => 'lbs', 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Garbage Truck',
        'equip_info_fields' => ['EqSN', 'Capacity', 'Type'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'yd' ]
    ],
    [
        'category' => 'Generator',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Hours', 'Type'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', 'Type', 'Capacity'],
        'unit' => [ 'Capacity' => 'kw', 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Knuckle Boom Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition', 'Length'],
        'unit' => [ 'Capacity' => 'ton']
    ],
    [
        'category' => 'Lift',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Length', 'Type'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', 'Length'],
        'unit' => [ 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Loader Backhoe',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', '4WD', 'Ext', 'AuxHyd', 'Cab', 'Hours'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', '4WD', 'Ext', 'AuxHyd'],
        'unit' => [ 'Hours' => 'Horas' ]

    ],
    [
        'category' => 'Mini Excavator',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'AuxHyd', 'Hours'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['AuxHyd', 'Hours'],
        'unit' => [ 'Hours' => 'Horas']
    ],
    [
        'category' => 'Mixer Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['Engine', 'TruckTrans', 'EqMake', 'EqModel',  'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'yd']
    ],
    [
        'category' => 'Parts',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Type'],
        'has_truck_info' => false,
        'title' => ['Type'],
        'details' => ['EqYear', 'EqMake', 'EqModel'],
        'unit' => [ ]
    ],
    [
        'category' => 'Platform Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Length'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Length'],
        'details' => ['TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => []
    ],
    [
        'category' => 'Replacements',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Type'],
        'has_truck_info' => false,
        'title' => ['Type'],
        'details' => ['EqYear', 'EqMake', 'EqModel'],
        'unit' => []
    ],
    [
        'category' => 'Motor Grader',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Ripper'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours', 'Ripper'],
        'unit' => [ 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Service Truck',
        'equip_info_fields' => [],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'TruckModel'],
        'details' => ['TruckYear', 'TruckMake', 'TruckModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => []
    ],
    [
        'category' =>  'Reefer Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Length'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'EqMake'],
        'details' => ['EqModel', 'Length'],
        'unit' => []
    ],
    [
        'category' => 'Box Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Length'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Length'],
        'details' => ['EqModel', 'Length'],
        'unit' => []
    ],
    [
        'category' => 'Drum Roller',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Cab', 'Length'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Cab', 'Length'],
        'unit' => []
    ],

    [
        'category' => 'Roll Off Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['Engine', 'TruckTrans', 'EqMake', 'EqModel', 'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'lbs']
    ],
    [
        'category' => 'Skid Steer',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours', 'Type', 'Cab'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours'],
        'unit' => [ 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Stationary Concrete Pump',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Hours'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours'],
        'unit' => [ 'Hours' => 'Horas']
    ],
    [
        'category' => 'Tow Truck',
        'equip_info_fields' => ['EqSn', 'Capacity'],
        'has_truck_info' => true,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Engine', 'TruckTrans', 'Capacity',],
        'unit' => [ 'Capacity' => 'ton' ]
    ],
    [
        'category' => 'Trailer',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Capacity', 'Length'],
        'has_truck_info' => false,
        'title' => ['EqkYear', 'EqkMake', 'Capacity'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'lbs']
    ],
    [
        'category' => 'Truck',
        'equip_info_fields' => ['Cab'],
        'has_truck_info' => true,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Engine', 'TruckTrans', 'TruckCondition'],
        'unit' => []
    ],
    [
        'category' => 'Unmounted Boom',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'Capacity', 'Type', 'Length'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqkMake', 'Capacity'],
        'details' => ['Type', 'EqModel', 'Length', 'Capacity'],
        'unit' => [ 'Capacity' => 'ton']
    ],
    [
        'category' => 'Vacuum Truck',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'EqModel'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => []
    ],
    [
        'category' => 'Wheel Loader',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN', 'Cab', 'Hours'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => ['Hours'],
        'unit' => [ 'Hours' => 'Horas' ]
    ],
    [
        'category' => 'Water Truck',
        'equip_info_fields' => ['EqSN', 'Capacity'],
        'has_truck_info' => true,
        'title' => ['TruckYear', 'TruckMake', 'Capacity'],
        'details' => ['EqModel', 'Engine', 'TruckTrans', 'Suspension', 'TruckCondition'],
        'unit' => [ 'Capacity' => 'gal' ]
    ],
    [
        'category' => 'Other',
        'equip_info_fields' => ['EqYear', 'EqMake', 'EqModel', 'EqSN'],
        'has_truck_info' => false,
        'title' => ['EqYear', 'EqMake', 'EqModel'],
        'details' => [],
        'unit' => [],
    ]
];

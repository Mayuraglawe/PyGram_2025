import { Router, RequestHandler } from "express";
import { Request, Response } from "express";

const router = Router();

// Smart Classroom Equipment Types
interface SmartEquipment {
  id: string;
  equipment_name: string;
  equipment_type: 'Smart Board' | 'Projector' | 'Audio System' | 'Camera' | 'Air Conditioner' | 'IoT Device';
  brand: string;
  model: string;
  serial_number: string;
  is_smart_enabled: boolean;
  status: 'Active' | 'Maintenance' | 'Inactive';
  specifications: Record<string, any>;
  installation_date: string;
  last_maintenance: string;
}

interface SmartClassroom {
  id: string;
  room_number: string;
  room_name: string;
  building: string;
  floor_number: number;
  capacity: number;
  room_type: 'Smart Classroom' | 'Lab' | 'Seminar' | 'Tutorial' | 'Auditorium';
  is_smart_enabled: boolean;
  is_hybrid_enabled: boolean;
  has_live_streaming: boolean;
  has_recording_capability: boolean;
  wifi_ssid: string;
  equipment: SmartEquipment[];
  current_status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  temperature?: number;
  humidity?: number;
  occupancy_count?: number;
}

// Mock data for smart classrooms
const mockSmartClassrooms: SmartClassroom[] = [
  {
    id: '1',
    room_number: 'A101',
    room_name: 'Smart Lecture Hall A101',
    building: 'Engineering Block A',
    floor_number: 1,
    capacity: 60,
    room_type: 'Smart Classroom',
    is_smart_enabled: true,
    is_hybrid_enabled: true,
    has_live_streaming: true,
    has_recording_capability: true,
    wifi_ssid: 'SmartClass_A101',
    current_status: 'Available',
    temperature: 24,
    humidity: 45,
    occupancy_count: 0,
    equipment: [
      {
        id: '1',
        equipment_name: 'Interactive Smart Board 75"',
        equipment_type: 'Smart Board',
        brand: 'Samsung',
        model: 'SB-75E',
        serial_number: 'SB001',
        is_smart_enabled: true,
        status: 'Active',
        specifications: {
          resolution: '4K',
          touch_points: 20,
          wifi: true
        },
        installation_date: '2023-01-15',
        last_maintenance: '2024-08-15'
      },
      {
        id: '2',
        equipment_name: '4K Projector',
        equipment_type: 'Projector',
        brand: 'Epson',
        model: 'EB-PU1007B',
        serial_number: 'PJ001',
        is_smart_enabled: true,
        status: 'Active',
        specifications: {
          resolution: '4K',
          brightness: '7000_lumens',
          wireless: true
        },
        installation_date: '2023-02-20',
        last_maintenance: '2024-07-20'
      }
    ]
  },
  {
    id: '2',
    room_number: 'A102',
    room_name: 'Interactive Lab A102',
    building: 'Engineering Block A',
    floor_number: 1,
    capacity: 30,
    room_type: 'Lab',
    is_smart_enabled: true,
    is_hybrid_enabled: false,
    has_live_streaming: false,
    has_recording_capability: true,
    wifi_ssid: 'SmartLab_A102',
    current_status: 'Occupied',
    temperature: 22,
    humidity: 50,
    occupancy_count: 25,
    equipment: []
  }
];

// Mock data for equipment
const mockSmartEquipment: SmartEquipment[] = [
  {
    id: '1',
    equipment_name: 'Interactive Smart Board 75"',
    equipment_type: 'Smart Board',
    brand: 'Samsung',
    model: 'SB-75E',
    serial_number: 'SB001',
    is_smart_enabled: true,
    status: 'Active',
    specifications: {
      resolution: '4K',
      touch_points: 20,
      wifi: true
    },
    installation_date: '2023-01-15',
    last_maintenance: '2024-08-15'
  },
  {
    id: '2',
    equipment_name: '4K Projector',
    equipment_type: 'Projector',
    brand: 'Epson',
    model: 'EB-PU1007B',
    serial_number: 'PJ001',
    is_smart_enabled: true,
    status: 'Active',
    specifications: {
      resolution: '4K',
      brightness: '7000_lumens',
      wireless: true
    },
    installation_date: '2023-02-20',
    last_maintenance: '2024-07-20'
  },
  {
    id: '3',
    equipment_name: 'Smart Audio System',
    equipment_type: 'Audio System',
    brand: 'Bose',
    model: 'SoundTouch SA-5',
    serial_number: 'AS001',
    is_smart_enabled: true,
    status: 'Active',
    specifications: {
      channels: '5.1',
      wireless: true,
      voice_control: true
    },
    installation_date: '2023-03-10',
    last_maintenance: '2024-06-10'
  }
];

// GET /api/smart-classrooms - Get all smart classrooms
export const getSmartClassrooms: RequestHandler = (req: Request, res: Response) => {
  try {
    const { building, floor, status, type } = req.query;
    
    let filteredClassrooms = [...mockSmartClassrooms];
    
    if (building) {
      filteredClassrooms = filteredClassrooms.filter(room => 
        room.building.toLowerCase().includes((building as string).toLowerCase())
      );
    }
    
    if (floor) {
      filteredClassrooms = filteredClassrooms.filter(room => 
        room.floor_number === parseInt(floor as string)
      );
    }
    
    if (status) {
      filteredClassrooms = filteredClassrooms.filter(room => 
        room.current_status === status
      );
    }
    
    if (type) {
      filteredClassrooms = filteredClassrooms.filter(room => 
        room.room_type === type
      );
    }
    
    res.json({
      success: true,
      data: filteredClassrooms,
      total: filteredClassrooms.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch smart classrooms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/smart-classrooms/:id - Get specific smart classroom
export const getSmartClassroomById: RequestHandler = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classroom = mockSmartClassrooms.find(room => room.id === id);
    
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Smart classroom not found'
      });
    }
    
    res.json({
      success: true,
      data: classroom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch smart classroom',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// PUT /api/smart-classrooms/:id/status - Update classroom status
export const updateClassroomStatus: RequestHandler = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, occupancy_count, temperature, humidity } = req.body;
    
    const classroomIndex = mockSmartClassrooms.findIndex(room => room.id === id);
    
    if (classroomIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Smart classroom not found'
      });
    }
    
    // Update classroom status
    if (status) mockSmartClassrooms[classroomIndex].current_status = status;
    if (occupancy_count !== undefined) mockSmartClassrooms[classroomIndex].occupancy_count = occupancy_count;
    if (temperature !== undefined) mockSmartClassrooms[classroomIndex].temperature = temperature;
    if (humidity !== undefined) mockSmartClassrooms[classroomIndex].humidity = humidity;
    
    res.json({
      success: true,
      message: 'Classroom status updated successfully',
      data: mockSmartClassrooms[classroomIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update classroom status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/smart-classrooms/:id/equipment - Get equipment for specific classroom
export const getClassroomEquipment: RequestHandler = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classroom = mockSmartClassrooms.find(room => room.id === id);
    
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Smart classroom not found'
      });
    }
    
    res.json({
      success: true,
      data: classroom.equipment,
      total: classroom.equipment.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom equipment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// PUT /api/smart-classrooms/:classroomId/equipment/:equipmentId - Update equipment status
export const updateEquipmentStatus: RequestHandler = (req: Request, res: Response) => {
  try {
    const { classroomId, equipmentId } = req.params;
    const { status, last_maintenance } = req.body;
    
    const classroom = mockSmartClassrooms.find(room => room.id === classroomId);
    
    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: 'Smart classroom not found'
      });
    }
    
    const equipmentIndex = classroom.equipment.findIndex(eq => eq.id === equipmentId);
    
    if (equipmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }
    
    // Update equipment status
    if (status) classroom.equipment[equipmentIndex].status = status;
    if (last_maintenance) classroom.equipment[equipmentIndex].last_maintenance = last_maintenance;
    
    res.json({
      success: true,
      message: 'Equipment status updated successfully',
      data: classroom.equipment[equipmentIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update equipment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/smart-classrooms/analytics/utilization - Get classroom utilization analytics
export const getClassroomUtilization: RequestHandler = (req: Request, res: Response) => {
  try {
    const utilizationData = {
      overall_utilization: 78.5,
      peak_hours: ['10:00-11:00', '14:00-15:00', '16:00-17:00'],
      most_used_rooms: mockSmartClassrooms
        .sort((a, b) => (b.occupancy_count || 0) - (a.occupancy_count || 0))
        .slice(0, 5)
        .map(room => ({
          room_number: room.room_number,
          room_name: room.room_name,
          utilization_rate: Math.random() * 100,
          total_hours_used: Math.floor(Math.random() * 40) + 10
        })),
      equipment_status: {
        active: mockSmartEquipment.filter(eq => eq.status === 'Active').length,
        maintenance: mockSmartEquipment.filter(eq => eq.status === 'Maintenance').length,
        inactive: mockSmartEquipment.filter(eq => eq.status === 'Inactive').length
      },
      environmental_data: {
        average_temperature: 23.5,
        average_humidity: 47.2,
        energy_consumption: 245.8
      }
    };
    
    res.json({
      success: true,
      data: utilizationData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch utilization analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Route definitions
router.get('/', getSmartClassrooms);
router.get('/analytics/utilization', getClassroomUtilization);
router.get('/:id', getSmartClassroomById);
router.put('/:id/status', updateClassroomStatus);
router.get('/:id/equipment', getClassroomEquipment);
router.put('/:classroomId/equipment/:equipmentId', updateEquipmentStatus);

export default router;
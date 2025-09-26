import { SmartClassroom, SmartEquipment, ClassroomUtilizationAnalytics } from "../../shared/smart-classroom-types";

// Smart Classroom Service - handles all smart classroom related operations
export class SmartClassroomService {
  
  // In a real implementation, these would be database operations
  private static mockClassrooms: SmartClassroom[] = [
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
      equipment: [],
      last_updated: new Date().toISOString()
    }
  ];

  private static mockEquipment: SmartEquipment[] = [
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
    }
  ];

  // Get all smart classrooms with optional filtering
  static async getAllClassrooms(filters?: {
    building?: string;
    floor?: number;
    status?: string;
    type?: string;
  }): Promise<SmartClassroom[]> {
    let classrooms = [...this.mockClassrooms];
    
    if (filters?.building) {
      classrooms = classrooms.filter(room => 
        room.building.toLowerCase().includes(filters.building!.toLowerCase())
      );
    }
    
    if (filters?.floor) {
      classrooms = classrooms.filter(room => 
        room.floor_number === filters.floor
      );
    }
    
    if (filters?.status) {
      classrooms = classrooms.filter(room => 
        room.current_status === filters.status
      );
    }
    
    if (filters?.type) {
      classrooms = classrooms.filter(room => 
        room.room_type === filters.type
      );
    }
    
    return classrooms;
  }

  // Get specific classroom by ID
  static async getClassroomById(id: string): Promise<SmartClassroom | null> {
    const classroom = this.mockClassrooms.find(room => room.id === id);
    return classroom || null;
  }

  // Update classroom status and environmental data
  static async updateClassroomStatus(
    id: string, 
    updates: {
      status?: string;
      occupancy_count?: number;
      temperature?: number;
      humidity?: number;
    }
  ): Promise<SmartClassroom | null> {
    const classroomIndex = this.mockClassrooms.findIndex(room => room.id === id);
    
    if (classroomIndex === -1) {
      return null;
    }
    
    // Update classroom properties
    if (updates.status) {
      this.mockClassrooms[classroomIndex].current_status = updates.status as any;
    }
    if (updates.occupancy_count !== undefined) {
      this.mockClassrooms[classroomIndex].occupancy_count = updates.occupancy_count;
    }
    if (updates.temperature !== undefined) {
      this.mockClassrooms[classroomIndex].temperature = updates.temperature;
    }
    if (updates.humidity !== undefined) {
      this.mockClassrooms[classroomIndex].humidity = updates.humidity;
    }
    
    this.mockClassrooms[classroomIndex].last_updated = new Date().toISOString();
    
    return this.mockClassrooms[classroomIndex];
  }

  // Get equipment for specific classroom
  static async getClassroomEquipment(classroomId: string): Promise<SmartEquipment[]> {
    const classroom = await this.getClassroomById(classroomId);
    return classroom?.equipment || [];
  }

  // Update equipment status
  static async updateEquipmentStatus(
    classroomId: string,
    equipmentId: string,
    updates: {
      status?: string;
      last_maintenance?: string;
    }
  ): Promise<SmartEquipment | null> {
    const classroom = this.mockClassrooms.find(room => room.id === classroomId);
    
    if (!classroom) {
      return null;
    }
    
    const equipmentIndex = classroom.equipment.findIndex(eq => eq.id === equipmentId);
    
    if (equipmentIndex === -1) {
      return null;
    }
    
    // Update equipment properties
    if (updates.status) {
      classroom.equipment[equipmentIndex].status = updates.status as any;
    }
    if (updates.last_maintenance) {
      classroom.equipment[equipmentIndex].last_maintenance = updates.last_maintenance;
    }
    
    return classroom.equipment[equipmentIndex];
  }

  // Get classroom utilization analytics
  static async getUtilizationAnalytics(): Promise<ClassroomUtilizationAnalytics> {
    // In a real implementation, this would query the database for actual usage data
    return {
      overall_utilization: 78.5,
      peak_hours: ['10:00-11:00', '14:00-15:00', '16:00-17:00'],
      most_used_rooms: this.mockClassrooms
        .sort((a, b) => (b.occupancy_count || 0) - (a.occupancy_count || 0))
        .slice(0, 5)
        .map(room => ({
          room_number: room.room_number,
          room_name: room.room_name,
          utilization_rate: Math.random() * 100,
          total_hours_used: Math.floor(Math.random() * 40) + 10
        })),
      equipment_status: {
        active: this.mockEquipment.filter(eq => eq.status === 'Active').length,
        maintenance: this.mockEquipment.filter(eq => eq.status === 'Maintenance').length,
        inactive: this.mockEquipment.filter(eq => eq.status === 'Inactive').length
      },
      environmental_data: {
        average_temperature: 23.5,
        average_humidity: 47.2,
        energy_consumption: 245.8
      }
    };
  }

  // Create new smart classroom
  static async createClassroom(classroomData: Omit<SmartClassroom, 'id' | 'last_updated'>): Promise<SmartClassroom> {
    const newClassroom: SmartClassroom = {
      ...classroomData,
      id: `classroom_${Date.now()}`,
      last_updated: new Date().toISOString()
    };
    
    this.mockClassrooms.push(newClassroom);
    return newClassroom;
  }

  // Update classroom details
  static async updateClassroom(id: string, updates: Partial<SmartClassroom>): Promise<SmartClassroom | null> {
    const classroomIndex = this.mockClassrooms.findIndex(room => room.id === id);
    
    if (classroomIndex === -1) {
      return null;
    }
    
    this.mockClassrooms[classroomIndex] = {
      ...this.mockClassrooms[classroomIndex],
      ...updates,
      id, // Ensure ID doesn't change
      last_updated: new Date().toISOString()
    };
    
    return this.mockClassrooms[classroomIndex];
  }

  // Delete classroom
  static async deleteClassroom(id: string): Promise<boolean> {
    const classroomIndex = this.mockClassrooms.findIndex(room => room.id === id);
    
    if (classroomIndex === -1) {
      return false;
    }
    
    this.mockClassrooms.splice(classroomIndex, 1);
    return true;
  }

  // Add equipment to classroom
  static async addEquipmentToClassroom(classroomId: string, equipment: Omit<SmartEquipment, 'id'>): Promise<SmartEquipment | null> {
    const classroom = this.mockClassrooms.find(room => room.id === classroomId);
    
    if (!classroom) {
      return null;
    }
    
    const newEquipment: SmartEquipment = {
      ...equipment,
      id: `equipment_${Date.now()}`
    };
    
    classroom.equipment.push(newEquipment);
    return newEquipment;
  }

  // Remove equipment from classroom
  static async removeEquipmentFromClassroom(classroomId: string, equipmentId: string): Promise<boolean> {
    const classroom = this.mockClassrooms.find(room => room.id === classroomId);
    
    if (!classroom) {
      return false;
    }
    
    const equipmentIndex = classroom.equipment.findIndex(eq => eq.id === equipmentId);
    
    if (equipmentIndex === -1) {
      return false;
    }
    
    classroom.equipment.splice(equipmentIndex, 1);
    return true;
  }

  // Get real-time classroom status (simulated IoT data)
  static async getRealTimeStatus(): Promise<Array<{
    classroom_id: string;
    room_number: string;
    current_status: string;
    occupancy_count: number;
    temperature: number;
    humidity: number;
    equipment_issues: string[];
    last_updated: string;
  }>> {
    return this.mockClassrooms.map(room => ({
      classroom_id: room.id,
      room_number: room.room_number,
      current_status: room.current_status,
      occupancy_count: room.occupancy_count || 0,
      temperature: room.temperature || 23,
      humidity: room.humidity || 45,
      equipment_issues: room.equipment
        .filter(eq => eq.status !== 'Active')
        .map(eq => `${eq.equipment_name}: ${eq.status}`),
      last_updated: room.last_updated || new Date().toISOString()
    }));
  }
}
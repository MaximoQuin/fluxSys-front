import axios from "axios";

interface Position {
  Id_position: number;
  Name_position: string;
  Name_company: string;
  Delete_log_position: boolean;
}

interface PositionCreate {
  Name_position: string;
  Id_company_Id: number;
}

interface PositionUpdate {
  Name_position: string;
  Id_company_Id: number;
}

const API_URL_POSITIONS = "http://localhost:5076/api/Positions/get-positions";

export default {
  async getPositions(): Promise<Position[]> {
    try {
      const response = await axios.get<Position[]>(API_URL_POSITIONS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo posiciones:", error);
      throw error;
    }
  },

  async createPosition(positionData: PositionCreate) {
    try {
      await axios.post(API_URL_POSITIONS, positionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error creando posición:", error);
      throw error;
    }
  },

  async updatePosition(id: number, positionData: PositionUpdate) {
    try {
      await axios.put(`${API_URL_POSITIONS}/${id}`, positionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error actualizando posición:", error);
      throw error;
    }
  },

  async deletePosition(id: number) {
    try {
      await axios.patch(`${API_URL_POSITIONS}/soft-delete/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error eliminando posición:", error);
      throw error;
    }
  },

  async restorePosition(id: number) {
    try {
      await axios.patch(`${API_URL_POSITIONS}/restore/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error restaurando posición:", error);
      throw error;
    }
  },
};

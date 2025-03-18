import { defineStore } from "pinia";
import positionsService from "@/services/positionsService";

interface Position {
  Id_position: number;
  Name_position: string;
  Name_company: string;
  Delete_log_position: boolean;
}

export const usePositionsStore = defineStore("positions", {
  state: (): { positions: Position[] } => ({
    positions: [],
  }),

  actions: {
    async fetchPositions() {
      try {
        this.positions = await positionsService.getPositions();
      } catch (error) {
        console.error("Error al obtener posiciones:", error);
      }
    },

    async addPosition(positionData: { Name_position: string; Id_company_Id: number }) {
      try {
        await positionsService.createPosition(positionData);
        await this.fetchPositions();
      } catch (error) {
        console.error("Error al agregar posición:", error);
      }
    },

    async updatePosition(id: number, positionData: { Name_position: string; Id_company_Id: number }) {
      try {
        await positionsService.updatePosition(id, positionData);
        await this.fetchPositions();
      } catch (error) {
        console.error("Error al actualizar posición:", error);
      }
    },

    async deletePosition(id: number) {
      try {
        await positionsService.deletePosition(id);
        await this.fetchPositions();
      } catch (error) {
        console.error("Error al eliminar posición:", error);
      }
    },

    async restorePosition(id: number) {
      try {
        await positionsService.restorePosition(id);
        await this.fetchPositions();
      } catch (error) {
        console.error("Error al restaurar posición:", error);
      }
    },
  },
});

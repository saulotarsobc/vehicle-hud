export interface Statistic {
  /**
   * Indica se o veículo está com a direita esquerda ativada
   */
  arrow_rigth: boolean;

  /**
   * Indica se o veículo está com a seta esquerda ativada
   */
  arrow_left: boolean;

  /**
   * Ângulo de inclinação esquerda/direita -90º - 90º
   */
  angle_y: number;

  /**
   * Ângulo de inclinação esquerda/direita -90º - 90º
   */
  angle_x: number;
}

import { BallisticSimInput } from "./ballistic-calculator-form-context";

export const CALIBRATION_RANGES = [25, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450];

export interface DropCalculatorInput {
  defaultAmmoInput: BallisticSimInput;
  secondAmmoInput: BallisticSimInput;
  calibrationDistances: number[];
  lineOfSightOverBore: number;
}

export interface BallisticSimDataPoint {
  Distance: number;
  Penetration: number;
  Damage: number;
  Speed: number;
  Drop: number;
  TimeOfFlight: number;
}

export interface BallisticCalculatorTableRow extends BallisticSimDataPoint {
  MilliradiansOfDrop: number,
  MaxDispersion: number
}

export function ConvertBSDPtoBCTR(input: BallisticSimDataPoint, totalWeaponAccuracyCRads: number): BallisticCalculatorTableRow {
  if(input.Distance === 0)
    return {...input, MilliradiansOfDrop: 0, MaxDispersion: 0 }

  const milliradiansFactor: number = input.Distance / 10; 
  const dropInCm: number = input.Drop * 100; // Drop is in M

  const milliradiansOfDrop: number = dropInCm / milliradiansFactor

  const maxDispersionInCm = input.Distance * totalWeaponAccuracyCRads;

  const output: BallisticCalculatorTableRow = {...input, MilliradiansOfDrop: milliradiansOfDrop, MaxDispersion: maxDispersionInCm}
  return output
}

export interface BallisticSimOutput {
  AmmoId: string;
  totalWeaponAccuracyCRads: number;
  DataPoints: BallisticSimDataPoint[];
}



export interface SimulationToCalibrationDistancePair{
  Distance: number,
  output: BallisticSimOutput
}

export interface BDC_Result{
  resultString: string,
  totalWeaponAccuracyCRads: number;
  dataPoints: SimulationToCalibrationDistancePair[];
}

export const TARKOV_100M_MOA_CM = 2.909

export function bsgAmmoFactor(ammoAcc: number){
  if(ammoAcc <= 0){
    return ((100 + Math.abs(ammoAcc)) / 100)
  }
  return (100 / (100 + ammoAcc))
}

export function getTarkovMOA(baseAccuracy: number, ammoAcc:number, additionalAccMod: number){
  return  ( 100 * baseAccuracy * bsgAmmoFactor(ammoAcc) * additionalAccMod ) / TARKOV_100M_MOA_CM
}

export function getModifiedCRadForResults(baseAccuracy: number, ammoAcc:number, additionalAccMod: number){
  return baseAccuracy * bsgAmmoFactor(ammoAcc) * additionalAccMod
}


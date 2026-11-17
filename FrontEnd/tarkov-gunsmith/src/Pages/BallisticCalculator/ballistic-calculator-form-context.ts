import { createFormContext, yupResolver } from "@mantine/form";
import * as yup from "yup";

const positiveNumber = (label: string) =>
  yup.number().typeError(`${label} must be a number`).moreThan(0, `${label} must be greater than 0`).required(`${label} is required`);

const nonNegativeNumber = (label: string) =>
  yup.number().typeError(`${label} must be a number`).min(0, `${label} cannot be negative`).required(`${label} is required`);

const ammoSchema = yup.object({
  name: yup.string().trim().required("Ammo name is required"),
  initialSpeed: positiveNumber("Initial speed"),
  ballisticCoefficient: positiveNumber("Ballistic coefficient"),
  bulletDiameterMillimeters: positiveNumber("Bullet diameter"),
  bulletMass: positiveNumber("Bullet mass"),
  penetration: nonNegativeNumber("Penetration"),
  damage: nonNegativeNumber("Damage"),
  accuracyModifier: yup.number().typeError("Accuracy modifier must be a number").required("Accuracy modifier is required"),
});

export const balCalValidationSchema = yup.object({
  weaponName: yup.string().trim().required("Weapon name is required"),
  weaponVelocityModifier: yup.number().typeError("Weapon velocity modifier must be a number").required("Weapon velocity modifier is required"),
  barrelVelocityModifier: yup.number().typeError("Barrel velocity modifier must be a number").required("Barrel velocity modifier is required"),
  weaponAccuracy: yup.number().typeError("Weapon accuracy must be a number").min(0).required("Weapon accuracy is required"),
  additionalVelocityModifier: yup.number().typeError("Additional velocity modifier must be a number").required("Additional velocity modifier is required"),
  additionalAccuracyModifier: yup.number().typeError("Additional accuracy modifier must be a number").required("Additional accuracy modifier is required"),
  calibrationAmmo: ammoSchema,
  calculationAmmo: ammoSchema,
  maxDistance: yup.number().typeError("Maximum distance must be a number").min(100).max(1600).required(),
  lineOfSightOverBore: yup.number().typeError("Height over bore must be a number").min(1).max(2000).required(),
}).test(
  "positive-final-velocity",
  "Combined velocity modifier must be greater than -100%.",
  values => !values || values.weaponVelocityModifier + values.barrelVelocityModifier + values.additionalVelocityModifier > -100,
);

export const balCalYupValidator = yupResolver(balCalValidationSchema);

export interface ManualAmmoStats {
  name: string;
  initialSpeed: number;
  ballisticCoefficient: number;
  bulletDiameterMillimeters: number;
  bulletMass: number;
  penetration: number;
  damage: number;
  accuracyModifier: number;
}

export interface BallisticCalculatorFormValues {
  weaponName: string;
  weaponVelocityModifier: number;
  barrelVelocityModifier: number;
  weaponAccuracy: number;
  calibrationAmmo: ManualAmmoStats;
  calculationAmmo: ManualAmmoStats;
  maxDistance: number;
  additionalVelocityModifier: number;
  additionalAccuracyModifier: number;
  lineOfSightOverBore: number;
}

export interface BallisticSimInput {
  AmmoId: string;
  BulletMass: number;
  BulletDiameterMillimeters: number;
  BallisticCoeficient: number;
  InitialSpeed: number;
  MaxDistance: number;
  Damage: number;
  Penetration: number;
}

export const [
  BallisticCalculatorFormProvider,
  useBallisticCalculatorFormContext,
  useBallisticCalculatorForm,
] = createFormContext<BallisticCalculatorFormValues>();

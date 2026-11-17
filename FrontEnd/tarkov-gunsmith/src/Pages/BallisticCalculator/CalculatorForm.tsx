import { useState } from "react";
import { balCalYupValidator, BallisticCalculatorFormProvider, useBallisticCalculatorForm } from "./ballistic-calculator-form-context";
import { Button, Divider, Grid, Group, Input, NumberInput, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { requestBallisticCalculation } from "./api-requests";
import { BDC_Result, CALIBRATION_RANGES, DropCalculatorInput, getModifiedCRadForResults, getTarkovMOA } from "./types";
import { RowCalculationAmmo } from "./form/row-calculation-ammo";
import { RowDefaultAmmo } from "./form/row-default-ammo";
import { InputMaxDistance } from "./components/input-max-distance";
import { InputHeightOverBore } from "./components/input-height-over-bore";
import { AdditionalAccuracyModifier } from "./components/input-additional-accuracy-mod";

export function CalculatorForm({ setResult, setIsLoading, setTimeStampRefreshHack }: {
    setResult: React.Dispatch<React.SetStateAction<BDC_Result | undefined>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setTimeStampRefreshHack: React.Dispatch<React.SetStateAction<number>>,
}) {
    const form = useBallisticCalculatorForm({
        initialValues: {
            weaponName: "",
            weaponVelocityModifier: 0,
            barrelVelocityModifier: 0,
            weaponAccuracy: 0,
            calibrationAmmo: {
                name: "",
                initialSpeed: 0,
                ballisticCoefficient: 0,
                bulletDiameterMillimeters: 0,
                bulletMass: 0,
                penetration: 0,
                damage: 0,
                accuracyModifier: 0,
            },
            calculationAmmo: {
                name: "",
                initialSpeed: 0,
                ballisticCoefficient: 0,
                bulletDiameterMillimeters: 0,
                bulletMass: 0,
                penetration: 0,
                damage: 0,
                accuracyModifier: 0,
            },
            maxDistance: 200,
            additionalVelocityModifier: 0,
            additionalAccuracyModifier: 0,
            lineOfSightOverBore: 68.58,
        },
        validate: balCalYupValidator,
    });

    const [isLoading, setLocalIsLoading] = useState(false);
    const mobileView = useMediaQuery("(max-width: 766px)");
    const { height } = useViewportSize();

    function onClickGenerate() {
        const validation = form.validate();
        if (validation.hasErrors) return;

        const values = form.getTransformedValues();
        const finalVelocityModifier =
            (100 + values.weaponVelocityModifier + values.barrelVelocityModifier + values.additionalVelocityModifier) / 100;
        const calibrationDistances = CALIBRATION_RANGES.filter(distance => distance <= values.maxDistance);
        const lineOfSightOverBore = values.lineOfSightOverBore / 1000;

        const toSimulationInput = (ammo: typeof values.calibrationAmmo, ammoId: string) => ({
            AmmoId: ammoId,
            BulletMass: ammo.bulletMass,
            BulletDiameterMillimeters: ammo.bulletDiameterMillimeters,
            BallisticCoeficient: ammo.ballisticCoefficient,
            InitialSpeed: ammo.initialSpeed * finalVelocityModifier,
            MaxDistance: values.maxDistance,
            Damage: ammo.damage,
            Penetration: ammo.penetration,
        });

        const dropCalculatorInput: DropCalculatorInput = {
            defaultAmmoInput: toSimulationInput(values.calibrationAmmo, "manual-calibration-ammo"),
            secondAmmoInput: toSimulationInput(values.calculationAmmo, "manual-calculation-ammo"),
            calibrationDistances,
            lineOfSightOverBore,
        };

        const accuracyModifier = (100 - values.additionalAccuracyModifier) / 100;
        const modifiedCRad = getModifiedCRadForResults(
            values.weaponAccuracy,
            values.calculationAmmo.accuracyModifier,
            accuracyModifier,
        );
        const tarkovMOA = getTarkovMOA(
            values.weaponAccuracy,
            values.calculationAmmo.accuracyModifier,
            accuracyModifier,
        );
        const resultString =
            `${values.weaponName} (calibration ammo: ${values.calibrationAmmo.name}) ` +
            `with ${values.calculationAmmo.name} @ ${finalVelocityModifier.toFixed(3)} velocity multiplier, ` +
            `${values.lineOfSightOverBore.toFixed(2)}mm height over bore and ${tarkovMOA.toFixed(2)} Tarkov MOA`;

        setIsLoading(true);
        setLocalIsLoading(true);
        requestBallisticCalculation(dropCalculatorInput)
            .then(response => {
                setResult({
                    resultString,
                    totalWeaponAccuracyCRads: modifiedCRad,
                    dataPoints: response,
                });
                form.resetDirty();
                setTimeStampRefreshHack(Date.now());
            })
            .catch(error => {
                alert(`Calculation error: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
                setLocalIsLoading(false);
            });
    }

    return (
        <BallisticCalculatorFormProvider form={form}>
            <form onSubmit={form.onSubmit(onClickGenerate)}>
                <ScrollArea.Autosize offsetScrollbars mah={!mobileView ? height - 200 : "100%"}>
                    <Divider label="Weapon" labelPosition="center" />
                    <Stack spacing="xs">
                        <TextInput
                            label="Weapon name"
                            placeholder="Enter a weapon name"
                            {...form.getInputProps("weaponName")}
                        />
                        <Grid gutter={4}>
                            <Grid.Col span={4}>
                                <NumberInput
                                    label="Weapon velocity modifier (%)"
                                    precision={1}
                                    step={0.1}
                                    {...form.getInputProps("weaponVelocityModifier")}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <NumberInput
                                    label="Barrel velocity modifier (%)"
                                    precision={1}
                                    step={0.1}
                                    {...form.getInputProps("barrelVelocityModifier")}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <NumberInput
                                    label="Other velocity modifier (%)"
                                    precision={1}
                                    min={-20}
                                    max={20}
                                    step={0.1}
                                    {...form.getInputProps("additionalVelocityModifier")}
                                />
                            </Grid.Col>
                        </Grid>
                        <NumberInput
                            label="Weapon accuracy (CRad)"
                            description="Enter the weapon or barrel center-of-impact value."
                            precision={4}
                            min={0}
                            step={0.0001}
                            {...form.getInputProps("weaponAccuracy")}
                        />

                        <RowDefaultAmmo />

                        <Divider label="Calculation Ammo" labelPosition="center" />
                        <Text size="xs" color="dimmed">
                            Enter the bullet whose trajectory you want to calculate. The calibration ammo above is used as the zeroing reference.
                        </Text>
                        <RowCalculationAmmo />

                        <AdditionalAccuracyModifier />

                        <Divider label="Misc" labelPosition="center" />
                        <Group pl={5} spacing={5}>
                            <InputMaxDistance />
                        </Group>
                        <Group pl={5} spacing={5}>
                            <Grid pl={8} grow>
                                <Grid.Col pl={0} span={3}>
                                    <InputHeightOverBore />
                                </Grid.Col>
                                <Grid.Col pt={12} pl={5} span={7}>
                                    <Input.Description>
                                        Distance in mm between the bore axis and sight axis. A typical 2.7" distance is 68.58mm.
                                    </Input.Description>
                                </Grid.Col>
                            </Grid>
                        </Group>
                    </Stack>
                </ScrollArea.Autosize>
                <Stack spacing="xs" pt={8}>
                    <Button fullWidth type="submit" disabled={isLoading} loading={isLoading}>
                        Generate Drop Table
                    </Button>
                    <Input.Description ml={20} w="auto">
                        A very special thanks to "sw_tower" whose help was integral to this feature.
                    </Input.Description>
                </Stack>
            </form>
        </BallisticCalculatorFormProvider>
    );
}

import { Grid, NumberInput, Stack, TextInput } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

type AmmoFieldPrefix = "calibrationAmmo" | "calculationAmmo";

export function ManualAmmoFields({ fieldPrefix }: { fieldPrefix: AmmoFieldPrefix }) {
    const form = useBallisticCalculatorFormContext();
    const field = (name: string) => `${fieldPrefix}.${name}`;

    return (
        <Stack spacing="xs">
            <TextInput
                label="Ammo name"
                placeholder="Enter an ammo name"
                {...form.getInputProps(field("name"))}
            />
            <Grid gutter={4}>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Initial speed (m/s)"
                        precision={1}
                        min={0}
                        step={1}
                        {...form.getInputProps(field("initialSpeed"))}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Ballistic coefficient"
                        precision={4}
                        min={0}
                        step={0.001}
                        {...form.getInputProps(field("ballisticCoefficient"))}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Bullet diameter (mm)"
                        precision={3}
                        min={0}
                        step={0.1}
                        {...form.getInputProps(field("bulletDiameterMillimeters"))}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Bullet mass (g)"
                        precision={3}
                        min={0}
                        step={0.1}
                        {...form.getInputProps(field("bulletMass"))}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Penetration"
                        precision={1}
                        min={0}
                        step={1}
                        {...form.getInputProps(field("penetration"))}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <NumberInput
                        label="Damage"
                        precision={1}
                        min={0}
                        step={1}
                        {...form.getInputProps(field("damage"))}
                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <NumberInput
                        label="Ammo accuracy modifier (%)"
                        precision={1}
                        step={0.1}
                        {...form.getInputProps(field("accuracyModifier"))}
                    />
                </Grid.Col>
            </Grid>
        </Stack>
    );
}

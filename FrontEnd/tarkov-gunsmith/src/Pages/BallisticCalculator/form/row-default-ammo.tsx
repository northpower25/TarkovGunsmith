import { Divider } from "@mantine/core";
import { ManualAmmoFields } from "./manual-ammo-fields";

export function RowDefaultAmmo() {
    return (
        <>
            <Divider label="Calibration Ammo" labelPosition="center" />
            <ManualAmmoFields fieldPrefix="calibrationAmmo" />
        </>
    );
}

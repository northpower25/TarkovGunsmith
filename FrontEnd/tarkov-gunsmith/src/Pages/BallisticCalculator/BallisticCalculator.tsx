import { Box, Button, Container, Divider, Grid, Group, MantineProvider, Modal, Paper, Title } from "@mantine/core";
import { SEO } from "../../Util/SEO";
import { CalculatorForm } from "./CalculatorForm";
import { useState } from "react";
import { BDC_Result } from "./types";
import { IconHelp } from "@tabler/icons-react";
import { DopeResultSection } from "./form/results-section";
import { FrequentlyAskedQuestions } from "./components/frequently-asked-questions";
import { useDisclosure } from "@mantine/hooks";

export function BallisticCalculator() {
    const [result, setResult] = useState<BDC_Result>();
    const [isLoading, setIsLoading] = useState(false);

    const [timeStampRefreshHack, setTimeStampRefreshHack] = useState<number>(0); //! This hacky thing is here to force the Table element to re-render with new data passed in, due to a limitation of MRT

    const [openedFAQ, { open: openFAQ, close: closeFAQ }] = useDisclosure(false);

    return (
        <>
            <SEO url="https://tarkovgunsmith.com/ballistic_calculator" title={'Ballistic Calculator : Tarkov Gunsmith'} />
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'dark',
                    breakpoints: {
                        xs: '30em',
                        sm: '48em',
                        md: '64em',
                        lg: '74em',
                        xl: '1540px',
                    },
                }}>
                <Container size={"99.5%"} px={0} pt={3}>
                    <Paper shadow="sm" p={2} px={5} mt={0}>

                        <Grid columns={24} px={4}>

                            <Grid.Col span={24} sm={12} md={10} lg={8} xl={6}>
                                <CalculatorForm
                                    setResult={setResult}
                                    setIsLoading={setIsLoading}
                                    setTimeStampRefreshHack={setTimeStampRefreshHack}
                                />
                                {result && (
                                    <>
                                        <Group position="center">
                                            <Button
                                                compact
                                                color="cyan"
                                                leftIcon={<IconHelp size="1rem" />}
                                                ml={10}
                                                mr={10}
                                                onClick={openFAQ}
                                            >
                                                Frequently Asked Questions
                                            </Button>
                                        </Group>
                                        <Modal opened={openedFAQ} onClose={closeFAQ} size={1400} title={<Title order={3}>Frequently Asked Questions</Title>}>
                                            <FrequentlyAskedQuestions />
                                        </Modal>
                                    </>
                                )}
                            </Grid.Col>

                            {!result && !isLoading && (
                                <Grid.Col span={24} sm={12} md={14} lg={16} xl={18}>
                                    <Box>
                                        <Divider label="Frequently Asked Questions" labelPosition="center" />
                                        <FrequentlyAskedQuestions />
                                    </Box>
                                </Grid.Col>
                            )}

                            {result && (
                                <Grid.Col span={24} sm={12} md={14} lg={16} xl={18}>
                                    <Divider label="Result" labelPosition="center" />
                                    <DopeResultSection
                                        isLoading={isLoading}
                                        result={result}
                                        timeStampRefreshHack={timeStampRefreshHack}
                                    />
                                </Grid.Col>
                            )}
                        </Grid>
                    </Paper>
                </Container>
            </MantineProvider>

        </>
    )
}
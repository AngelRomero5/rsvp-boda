import './RSVP.css'
import { Card, Text, Button, Group } from '@mantine/core';
import { useState } from "react";
import Countdown from './Countdown';

function RSVP() {
    const [section, setSection] = useState<"1" | "2">("1");

    return (
        <div>

            {/* --- SECCIÓN 1 --- */}
            {section === "1" && (
                <section id="RSVP">
                    <Card shadow="sm" padding="lg" radius="md" withBorder className="rsvp-card">
                        <h2 className='rsvp-title'>Ángel & Mariana</h2>
                        <hr className="rsvp-divider" />
                        <Text>¡Confirma tu asistencia!</Text>
                        <Countdown
                            timeTillDate="2026-07-11 14:00"
                            timeFormat="YYYY-MM-DD HH:mm"
                        />       
                        <Text>Fecha: Sábado, 11 de Julio de 2026, 2:00 PM</Text>
                        <Text>Dirección: 120 Calle Blvd de la Fuente, San Juan, 00926</Text>
                        <Text component="a" href="#https://maps.app.goo.gl/iqj1iCJ3BLC2dbQo9">Pin del lugar</Text>
                    <Button
                        className="rsvp-button"
                        onClick={() => setSection("2")}>RSVP
                    </Button>
                    </Card>
                </section>
            )}

            {/* --- SECCIÓN 2 (RSVP) --- */}
            {section === "2" && (
                <section id="RSVP">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Button
                            variant="subtle"
                            size="xs"
                            className="rsvp-back-button"
                            onClick={() => setSection("1")}
                        >
                            Regresar
                        </Button>

                        <div className="rsvp-header">
                            <h2 className="rsvp-title">RSVP</h2>
                            <Text size="xs" color="dimmed" className="rsvp-description">
                                Confirma tu asistencia a nuestra boda. ¡Nos encantaría contar contigo!
                            </Text>
                        </div>

                        <hr className="rsvp-divider" />

                        <form autoComplete="off">
                            <Group>
                                <Text fw={500} size="sm">Nombre</Text>
                                <input type="text" id="name" name="name" autoComplete="off" required />
                            </Group>

                            <Group>
                                <Text fw={500} size="sm">Número de Acompañantes</Text>
                                <input type="number" id="guests" name="guests" min="0" autoComplete="off" required />
                            </Group>

                            <Group>
                                <Text fw={500} size="sm">Correo Electrónico</Text>
                                <input type="email" id="email" name="email" autoComplete="off" required />
                            </Group>

                            <Group>
                                <Text fw={500} size="sm">Teléfono</Text>
                                <input type="tel" id="telefono" name="telefono" autoComplete="off" required />
                            </Group>

                            <Button fullWidth mt="md" radius="sm" type="submit" className="rsvp-button">
                                Confirmar
                            </Button>
                        </form>
                    </Card>
                </section>
            )}
        </div>
    );
}

export default RSVP;
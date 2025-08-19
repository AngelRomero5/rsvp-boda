import './RSVP.css'
import { Card, Text, Button, Group } from '@mantine/core';


function RSVP() {
    return (
        <>
            <section id="RSVP">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Button variant="subtle" size="xs" className='rsvp-back-button'>
                       Regresar
                    </Button>
                    <div className='rsvp-header'>
                        <h2 className="rsvp-title">RSVP</h2>
                        <Text size="xs" color="dimmed" className="rsvp-description">
                            Confirma tu asistencia a nuestra boda. ¡Nos encantaría contar contigo!
                        </Text>
                    </div>
                    <hr className="rsvp-divider" />
                    <form autoComplete="off">
                        <Group>
                            <Text fw={500} size='sm'>Nombre</Text>
                            <input type="text" id="name" name="name" autoComplete="off" required />
                        </Group>

                        <Group>
                            <Text fw={500} size='sm'>Número de Acompañantes</Text>
                            <input type="number" id="guests" name="guests" min="0" autoComplete="off" required />
                        </Group>

                        <Group>
                            <Text fw={500} size='sm'>Correo Electrónico</Text>
                            <input type="email" id="email" name="email" autoComplete="off" required />
                        </Group>

                        <Group>
                            <Text fw={500} size='sm'>Teléfono</Text>
                            <input type="tel" id="telefono" name="telefono" autoComplete="off"  required />
                        </Group>
                        
                        <Button fullWidth mt="md" radius="sm" type="submit" className='rsvp-button'>
                            Confirmar
                        </Button>
                    </form>
                </Card>
            </section>
        </>
    )
}

export default RSVP
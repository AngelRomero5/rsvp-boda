import './RSVP.css'
import { Card, Text, Button, Group, SimpleGrid } from '@mantine/core';
import { useState } from "react";
import Countdown from './Countdown';
import { Image } from '@mantine/core';
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";



function RSVP() {
    const [section, setSection] = useState<"1" | "2" | "3" | "4">("2");
    const breakpointColumnsObj = {
        default: 4,
        1100: 4,
        700: 3,
        500: 2
    };

    const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png}', { eager: true });
    const ourPictures = Object.values(imageModules).map((img: any) => ({
        src: img.default
    }));


    return (
        <SimpleGrid cols={1} id="RSVP">
            {/* --- SECCIÓN 1 --- */}
            {section === "1" && (
                <section className="rsvp-section">
                    <Card shadow='sm' radius='md' withBorder>
                        <Card padding="sm" radius="md" withBorder className="rsvp-card">
                            <h2 className='rsvp-title'>Ángel & Mariana</h2>
                            <Image radius="md" w="auto" h={400} src='/images/us1.jpeg' alt='Ángel & Mariana' className='rsvp-photo'/>
                            <hr className="rsvp-divider" />
                            <Text className='text'>¡Confirma tu asistencia!</Text>
                            <Countdown
                                timeTillDate="2026-07-11 14:00"
                                timeFormat="YYYY-MM-DD HH:mm"
                                />
                            <Text>Fecha: Sábado, 11 de Julio de 2026, 2:00 PM</Text>
                            <Text>Dirección: 120 Calle Blvd de la Fuente, San Juan, 00926</Text>
                            <Text component="a" href="https://maps.app.goo.gl/iqj1iCJ3BLC2dbQo9">Pin del lugar</Text>
                            <Button
                                className="rsvp-button"
                                onClick={() => setSection("2")}>RSVP
                            </Button>
                        </Card>
                    </Card>
                </section>
            )}

            {/* --- SECCIÓN 2 (RSVP) --- */}
            {section === "2" && (
                <section className="rsvp-section">
                    <Card shadow='sm' radius='md' withBorder >                    
                        <Card padding="lg" radius="md" withBorder className='rsvp-card'>
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
                                <Text size="xs" c="dimmed" className="rsvp-description">
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
                    </Card>
                </section>
            )}
            {/* Seccion galeria: fotos de nosotros */}
            {section === "3" && (
                <section className='rsvp-gallery-section'>
                    <h2 className='rsvp-title'>Galería de fotos</h2>
                    <Masonry
                        breakpointCols={breakpointColumnsObj} // number of columns on desktop
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {ourPictures.map((photo, index) => (
                            <motion.img
                                key={index}
                                src={photo.src}
                                alt={`Photo ${index + 1}`}
                                initial={{ opacity: 0, y: 20 }} // start invisible, slightly down
                                whileInView={{ opacity: 1, y: 0 }} // fade in when in viewport
                                viewport={{ once: true, amount: 0.3 }} // trigger once, 30% visible
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                style={{ width: '100%', display: 'block', marginBottom: '16px', borderRadius: '8px' }}
                            />
                        ))}
                    </Masonry>     
                </section>
            )}
                 
            {/* --- SECCIÓN 3 (FORMAS DE AYUDA) --- */}
            {/* TODO aqui faltan los iconos de cada metodo de ayuda y estilos */}
            {section === "4" && (
                <section className="rsvp-section">
                    <Card shadow='sm' radius='md' withBorder>
                        <Card padding="lg" radius="md" withBorder className='rsvp-card'>
                                <h2>Formas de ayudarnos</h2>
                                <Text size="sm" c="dimmed">Si deseas ayudarnos y formar parte de esta nueva aventura que comienza,</Text>
                                <Text size="sm" c="dimmed">puedes hacerlo a través de las siguientes opciones:</Text>
                                <Text fw={500}>Ath Móvil:</Text>
                                <Text>Ángel : (787) 710-1934</Text>
                                <Text>Mariana : (787) 690-2236</Text>
                                <Text>PayPal: @agabrielrr0 </Text>
                                <Text component="a" href="https://www.amazon.com/hz/wishlist/ls/3BTN6FLFZUUN1?ref_=wl_share">Amazon Wishlist</Text>
                        </Card>
                    </Card>
                </section>
            )}
        </SimpleGrid>
    );
}

export default RSVP;
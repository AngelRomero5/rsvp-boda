import { Card, Text, Button, Group, SimpleGrid, Image, Stack } from '@mantine/core';
import { useState } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";


import './RSVP.css'
import NavBar from "./NavBar";
import Countdown from './Countdown';


function RSVP() {

    // State to manage the current section
    const [section, setSection] = useState<"rsvp" | "historia" | "galeria" | "ayudanos" | "2">("rsvp");
    const breakpointColumnsObj = {
        default: 4,
        1100: 4,
        700: 3,
        500: 2
    };

    // Import all the images from the assets folder for the gallery
    const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png}', { eager: true });
    const ourPictures = Object.values(imageModules).map((img: any) => ({
        src: img.default
    }));


    return (
        
        <SimpleGrid cols={1} id="RSVP">
            <NavBar section={section} setSection={setSection} />

            {/* --- SECCIÓN 1 --- */}
            {section === "rsvp" && (
                <motion.section initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }} className="rsvp-section">
                    <Card shadow='sm' radius='md' withBorder>
                        <Card padding="sm" radius="md" withBorder className="rsvp-card">
                            <h2 className='rsvp-title'>Ángel & Mariana</h2>
                            <Image radius="md" w="auto" h={400} src='/images/us1.jpeg' alt='Ángel & Mariana' className='rsvp-photo'/>
                            <hr className="rsvp-divider" />
                            <Countdown
                                timeTillDate="2026-07-11 14:00"
                                timeFormat="YYYY-MM-DD HH:mm"
                                />
                            <h3 className='rsvp-subtitle'>¡Confirma tu asistencia!</h3>

                            <Text size='md'>Fecha: Sábado, 11 de Julio de 2026, 2:00 PM</Text>
                            <Text size='md'>Dirección: 120 Calle Blvd de la Fuente, San Juan, 00926</Text>
                            <Text size='md' component="a" href="https://maps.app.goo.gl/iqj1iCJ3BLC2dbQo9">Pin del lugar</Text>
                            <Button
                                className="rsvp-button"
                                onClick={() => setSection("2")}>RSVP
                            </Button>
                        </Card>
                    </Card>
                </motion.section>
            )}

            {/* --- SECCIÓN 2 (RSVP) --- */}
            {section === "2" && (
                <motion.section initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }} className="rsvp-section">
                    <Card shadow='sm' radius='md' withBorder >                    
                        <Card padding="lg" radius="md" withBorder className='rsvp-card'>
                            <Button
                                variant="subtle"
                                size="xs"
                                className="rsvp-back-button"
                                onClick={() => setSection("rsvp")}
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
                </motion.section>
            )}
            {/* Seccion galeria: fotos de nosotros */}
            {section === "galeria" && (
                <motion.section className='rsvp-gallery-section'>
                    <h2 className='rsvp-title'>Galería de fotos</h2>
                    <Text size='md' c='dimmed'>Una selección de nuestros momentos favoritos ❤️</Text>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
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
                </motion.section>
            )}
                 
            {/* --- SECCIÓN 3 (FORMAS DE AYUDA) --- */}
            {section === "ayudanos" && (
                <motion.section className="rsvp-section">
                    <SimpleGrid cols={2} spacing="md">
                        <Image src="/images/_MG_4681.jpeg" alt="us" w={600} radius={"md"} />
                        <Stack>
                            <Card shadow='sm' radius='md' withBorder>
                                <Card padding="lg" radius="md" withBorder className='rsvp-card'>
                                    <h2 className='rsvp-title'>¿Cómo nos puedes apoyar?</h2>
                                    <Stack gap={2} mb={"md"} align="center">
                                        <Text size="sm" c="dimmed">Si deseas dejar tu huella y formar parte de esta nueva aventura</Text>
                                        <Text size="sm" c="dimmed">puedes hacerlo a través de las siguientes opciones:</Text>
                                    </Stack>
                                    <Stack gap="lg" className="donate-options">
                                        {/* Ath Móvil */}
                                        <Group align="flex-start" gap="md">
                                            <Image src="/images/athmovil.png" alt="Ath Móvil" className="donate-icon" />
                                            <Stack gap={2}>
                                                <Text c="blue">(787) 710-1934</Text>
                                                <Text c="grape">(787) 690-2236</Text>
                                            </Stack>
                                        </Group>

                                        {/* PayPal */}
                                        <Group align="center" gap="md">
                                            <Image src="/images/paypal.png" alt="PayPal" className="donate-icon"  />
                                            <Text component="a" href="https://www.paypal.com/paypalme/agabrielrr0">@agabrielrr0</Text>
                                        </Group>

                                        {/* Amazon */}
                                        <Group align="center" gap="md">
                                            <Image src="/images/amazon.png" alt="Amazon Wishlist" className="donate-icon" />
                                            <Text component="a" href="https://www.amazon.com/hz/wishlist/ls/3BTN6FLFZUUN1?ref_=wl_share">Amazon Wishlist</Text>
                                        </Group>
                                    </Stack>
                                </Card>
                            </Card>
                            <Text ta="center" className='rsvp-thank-you'>¡Gracias por tu apoyo!</Text>
                        </Stack>
                    </SimpleGrid>
                </motion.section>
            )}
        </SimpleGrid>
    );
}

export default RSVP;
import { Card, Text, Button, Group, SimpleGrid, Image, Stack, TextInput, Textarea, Alert, ActionIcon, Tooltip, Divider, Select, Checkbox, Modal, Table, Badge } from '@mantine/core';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { IconCheck, IconAlertCircle, IconCopy, IconExternalLink, IconHeart, IconGift, IconPhone, IconDownload, IconUpload, IconX } from '@tabler/icons-react';
import moment from 'moment';

import './RSVP.css'
import NavBar from "./NavBar";
import Countdown from './Countdown';

// Guest data types
interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    age?: number;
}

interface Guest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    family: FamilyMember[];
    isConfirmed: boolean;
    confirmationDate?: string;
    dietaryRestrictions?: string;
    message?: string;
}

// Initial guest list - you can modify this with your actual guest list
const initialGuestList: Guest[] = [
    {
        id: '1',
        name: 'María González',
        email: 'maria@email.com',
        phone: '(787) 123-4567',
        family: [
            { id: '1-1', name: 'Carlos González', relationship: 'Esposo' },
            { id: '1-2', name: 'Ana González', relationship: 'Hija', age: 8 }
        ],
        isConfirmed: false
    },
    {
        id: '2',
        name: 'José Rodríguez',
        email: 'jose@email.com',
        phone: '(787) 234-5678',
        family: [
            { id: '2-1', name: 'Carmen Rodríguez', relationship: 'Esposa' }
        ],
        isConfirmed: false
    },
    {
        id: '3',
        name: 'Laura Martínez',
        email: 'laura@email.com',
        phone: '(787) 345-6789',
        family: [],
        isConfirmed: false
    },
    {
        id: '4',
        name: 'Roberto Silva',
        email: 'roberto@email.com',
        phone: '(787) 456-7890',
        family: [
            { id: '4-1', name: 'Elena Silva', relationship: 'Esposa' },
            { id: '4-2', name: 'Diego Silva', relationship: 'Hijo', age: 12 },
            { id: '4-3', name: 'Sofia Silva', relationship: 'Hija', age: 10 }
        ],
        isConfirmed: false
    }
];


function RSVP() {

    // State to manage the current section
    const [section, setSection] = useState<"rsvp" | "historia" | "galeria" | "ayudanos" | "2">("rsvp");
    
    // Guest management state
    const [guestList, setGuestList] = useState<Guest[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<string[]>([]);
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        guests: 0,
        email: '',
        dietaryRestrictions: '',
        message: ''
    });
    
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

    // Form validation
    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
        }
        
        if (formData.guests < 0) {
            errors.guests = 'El número de acompañantes no puede ser negativo';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Por favor ingresa un correo electrónico válido';
        }
    
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        setSubmitStatus('idle');
        
        try {
            // Formspree integration - replace 'YOUR_FORM_ID' with your actual Formspree form ID
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    guests: formData.guests,
                    email: formData.email,
                    dietaryRestrictions: formData.dietaryRestrictions,
                    message: formData.message,
                    _subject: `RSVP de ${formData.name} - Boda Ángel & Mariana`,
                }),
            });
            
            if (response.ok) {
                setSubmitStatus('success');
                
                // Mark guest as confirmed
                if (selectedGuest) {
                    const updatedGuests = guestList.map(guest => {
                        if (guest.id === selectedGuest.id) {
                            return {
                                ...guest,
                                isConfirmed: true,
                                confirmationDate: new Date().toISOString(),
                                dietaryRestrictions: formData.dietaryRestrictions,
                                message: formData.message,
                                email: formData.email,
                            };
                        }
                        return guest;
                    });
                    saveGuestList(updatedGuests);
                }
                
                // Reset form after successful submission
                setTimeout(() => {
                    setFormData({
                        name: '',
                        guests: 0,
                        email: '',
                        dietaryRestrictions: '',
                        message: ''
                    });
                    setSelectedGuest(null);
                    setSelectedFamilyMembers([]);
                    setSubmitStatus('idle');
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Copy to clipboard functionality
    const copyToClipboard = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItems(prev => ({ ...prev, [itemId]: true }));
            setTimeout(() => {
                setCopiedItems(prev => ({ ...prev, [itemId]: false }));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Scroll to top functionality
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Guest management functions
    const loadGuestList = () => {
        const savedGuests = localStorage.getItem('weddingGuestList');
        if (savedGuests) {
            setGuestList(JSON.parse(savedGuests));
        } else {
            setGuestList(initialGuestList);
            localStorage.setItem('weddingGuestList', JSON.stringify(initialGuestList));
        }
    };

    const saveGuestList = (guests: Guest[]) => {
        setGuestList(guests);
        localStorage.setItem('weddingGuestList', JSON.stringify(guests));
    };

    const handleGuestSelection = (guestId: string) => {
        const guest = guestList.find(g => g.id === guestId);
        if (guest) {
            setSelectedGuest(guest);
            setFormData({
                name: guest.name,
                guests: guest.family.length,
                email: guest.email || '',
                dietaryRestrictions: guest.dietaryRestrictions || '',
                message: guest.message || ''
            });
            // Pre-select all family members
            setSelectedFamilyMembers(guest.family.map(f => f.id));
        }
    };

    const handleFamilyMemberToggle = (memberId: string) => {
        setSelectedFamilyMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const exportGuestData = () => {
        const dataStr = JSON.stringify(guestList, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'wedding-guest-list.json';
        link.click();
        URL.revokeObjectURL(url);
    };


    // Load guest list on component mount
    useEffect(() => {
        loadGuestList();
    }, []);

    const breakpointColumnsObj = {
        default: 4,
        1100: 4,
        700: 3,
        500: 2
    };

    // Import all the images from the assets folder for the gallery (lazy loaded)
    const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png}', { eager: false });
    const [loadedImages, setLoadedImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    
    // Modal state for image viewer
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');

    // Load images progressively
    useEffect(() => {
        if (section === 'galeria' && !loadingImages && loadedImages.length === 0) {
            setLoadingImages(true);
            const loadImages = async () => {
                const imagePromises = Object.values(imageModules).map(async (importFn: any) => {
                    const module = await importFn();
                    return module.default;
                });
                
                // Load images in batches to prevent overwhelming the browser
                const batchSize = 10;
                const results: string[] = [];
                
                for (let i = 0; i < imagePromises.length; i += batchSize) {
                    const batch = await Promise.all(imagePromises.slice(i, i + batchSize));
                    results.push(...batch);
                    setLoadedImages([...results]);
                    // Small delay between batches to prevent stuttering
                    if (i + batchSize < imagePromises.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                setLoadingImages(false);
            };
            
            loadImages();
        }
    }, [section, loadedImages.length, loadingImages]);


    return (
        <>
        <SimpleGrid cols={1} id="RSVP">
            <NavBar section={section} setSection={setSection} onAdminClick={() => setAdminModalOpen(true)} />

            {/* --- SECCIÓN 1 --- */}
            {section === "rsvp" && (
                <motion.section initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }} className="rsvp-section">
                    
                    {/* Hero Section with Countdown */}
                    <motion.div initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }} className="hero-section">
                        <Card radius="md" withBorder className="hero-card">
                            <Stack gap="xl" align="center">
                                <div className="hero-text-section">
                                    <h1 className='hero-title'>Ángel & Mariana</h1>
                                    <Text size="lg" c="#243e5a" fw={400} ta="center" className="hero-subtitle">
                                        11 de Julio de 2026  💍  San Juan, PR
                                    </Text>
                                </div>
                                <Image radius="lg" w="auto" h={500} src='/images/us1.jpeg' alt='Ángel & Mariana' className='hero-photo'/>
                            
                            {/* Countdown inside the same card */}
                            <motion.div initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.4 }} className="countdown-inside-card">
                                <hr className="rsvp-divider" />
                                <h2 className="save-the-date-title">
                                    Save The Date
                                </h2>
                                <Countdown
                                    timeTillDate="2026-07-11 13:30"
                                    timeFormat="YYYY-MM-DD HH:mm"
                                />
                            </motion.div>
                            </Stack>
                        </Card>
                    </motion.div>

                    {/* Wedding Details Section */}
                    <motion.div initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.4 }}>
                        <Card radius="md" withBorder className="rsvp-card">
                            <hr className="rsvp-divider" />

                            <h3 className='rsvp-subtitle'>¡Confirma tu asistencia!</h3>

                            <Stack gap="md" className="wedding-details">
                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Text fw={600} size="lg" c="#243e5a" mb="sm">📅 Fecha y Hora</Text>
                                    <Text size="md">Sábado, 11 de Julio de 2026</Text>
                                    <Text size="md" c="#243e5a" fw={500}>1:30 PM - Ceremonia</Text>
                                    <Text size="sm" c="dimmed">6:00 PM - Recepción</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Text fw={600} size="lg" c="#243e5a" mb="sm">💒 Ceremonia</Text>
                                    <Text size="md" component="a" href="https://maps.app.goo.gl/iqj1iCJ3BLC2dbQo9" c='#88a9c3'>
                                        120 Calle Blvd de la Fuente, San Juan, 00926
                                    </Text>
                                    <Text size="sm" c="dimmed" mt="xs">Iglesia San José</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Text fw={600} size="lg" c="#243e5a" mb="sm">🎉 Recepción</Text>
                                    <Text size="md" component="a" href="https://maps.app.goo.gl/6CXjuRubJbq98fji6" c='#88a9c3'>
                                        Carretera PR 189, Km. 5.3, Gurabo, 00778
                                    </Text>
                                    <Text size="sm" c="dimmed" mt="xs">Zafra del Caribe</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Text fw={600} size="lg" c="#243e5a" mb="sm">👗 Código de Vestimenta</Text>
                                    <Text size="md">Formal Elegante</Text>
                                    <Text size="sm" c="dimmed">Todos los colores menos BLANCO</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Text fw={600} size="lg" c="#243e5a" mb="sm">🚗 Estacionamiento</Text>
                                    <Text size="md">Disponible en ambos lugares</Text>
                                    <Text size="sm" c="dimmed">Debajo de la parroquia y frente al centro comercial. 
                                        En la recepción también habrá estacionamiento</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Text fw={600} size="lg" c="#243e5a" mb="sm">📞 Contacto</Text>
                                    <Text size="md">¿Preguntas? Contáctanos:</Text>
                                    <Text size="sm" c="#243e5a" fw={500}>Ángel: (787) 710-1934</Text>
                                    <Text size="sm" c="#243e5a" fw={500}>Mariana: (787) 690-2236</Text>
                                </Card>
                            </Stack>

                            <Button
                                className="rsvp-button"
                                mt={"lg"}
                                size="lg"
                                onClick={() => {
                                    setSection("2");
                                    scrollToTop();
                                }}>
                                Confirmar Asistencia
                            </Button>
                        </Card>
                    </motion.div>
                </motion.section>
            )}

            {/* --- SECCIÓN 2 (RSVP) --- */}
            {section === "2" && (
                <motion.section initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }} className="rsvp-section">
                        <Card radius="md" withBorder className='rsvp-card'>
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

                            {submitStatus === 'success' ? (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}>
                                    <Alert icon={<IconCheck size="1rem" />} title="¡Confirmación Exitosa!" color="green" variant="light">
                                        <Text size="sm">
                                            ¡Gracias por confirmar tu asistencia! Te hemos enviado un correo de confirmación.
                                            ¡Nos vemos el 11 de julio!
                                        </Text>
                                    </Alert>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <Stack gap="md">
                                        <Select
                                            label="Selecciona tu nombre de la lista"
                                            placeholder="Nana Rodríguez"
                                            data={guestList.map(guest => ({
                                                value: guest.id,
                                                label: guest.name,
                                                disabled: guest.isConfirmed
                                            }))}
                                            value={selectedGuest?.id || ''}
                                            onChange={(value) => value && handleGuestSelection(value)}
                                            searchable
                                            required
                                            size="md"
                                        />

                                        {selectedGuest && (
                                            <Alert color="blue" variant="light">
                                                <Text size="sm">
                                                    {selectedGuest.isConfirmed 
                                                        ? "✅ Ya has confirmado tu asistencia" 
                                                        : "Selecciona los miembros de tu familia que asistirán:"
                                                    }
                                                </Text>
                                            </Alert>
                                        )}

                                        {selectedGuest && !selectedGuest.isConfirmed && selectedGuest.family.length > 0 && (
                                            <div>
                                                <Stack gap="xs">
                                                    {selectedGuest.family.map((member) => (
                                                        <Checkbox
                                                            key={member.id}
                                                            label={`${member.name} (${member.relationship}${member.age ? `, ${member.age} años` : ''})`}
                                                            checked={selectedFamilyMembers.includes(member.id)}
                                                            onChange={() => handleFamilyMemberToggle(member.id)}
                                                        />
                                                    ))}
                                                </Stack>
                                            </div>
                                        )}

                                        <TextInput
                                            label="Correo Electrónico"
                                            placeholder="mirailabestia@correo.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            error={formErrors.email}
                                            required
                                            size="md"
                                        />

                                        <Textarea
                                            label="Restricciones Alimentarias (Opcional)"
                                            placeholder="Alergias, vegetarianismo, etc."
                                            value={formData.dietaryRestrictions}
                                            onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                                            size="md"
                                            minRows={2}
                                        />

                                        <Textarea
                                            label="Mensaje para los Novios (Opcional)"
                                            placeholder="¡Déjanos un mensaje especial!"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            size="md"
                                            minRows={3}
                                        />

                                        {submitStatus === 'error' && (
                                            <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" variant="light">
                                                <Text size="sm">
                                                    Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.
                                                </Text>
                                            </Alert>
                                        )}

                                        <Button 
                                            fullWidth 
                                            mt="md" 
                                            radius="sm" 
                                            type="submit" 
                                            className="rsvp-button"
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Enviando...' : 'Confirmar Asistencia'}
                                        </Button>
                                    </Stack>
                                </form>
                            )}
                        </Card>
                </motion.section>
            )}
            {/* --- SECCIÓN HISTORIA --- */}
            {section === "historia" && (
                <motion.section initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }} className="rsvp-section">
                    <Card radius="md" withBorder className='rsvp-card'>
                        <h2 className='rsvp-title'>¿Cómo comenzó nuestra historia?</h2>
                        <Image src='/images/gold-flower.png' alt='flower divider' w={150} h={100} />
                        
                        <Stack gap="lg" className="historia-content">
                            <motion.div initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.2 }}>
                                <Text size="lg" ta="center" c="dimmed" className="historia-text">
                                    Todo comenzó en una tarde soleada de primavera, cuando nuestros caminos se cruzaron de la manera más inesperada...
                                </Text>
                            </motion.div>

                            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" className="historia-timeline">
                                <motion.div initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}>
                                    <Card withBorder radius="md" p="md" className="timeline-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">Primer Encuentro</Text>
                                        <Text size="sm" c="dimmed">
                                            Nos conocimos en una cafetería del Viejo San Juan. Una sonrisa, una mirada, y supe que algo especial había comenzado.
                                        </Text>
                                    </Card>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}>
                                    <Card withBorder radius="md" p="md" className="timeline-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">Primera Cita</Text>
                                        <Text size="sm" c="dimmed">
                                            Una caminata por el Malecón de San Juan al atardecer. El océano como testigo de nuestras primeras risas compartidas.
                                        </Text>
                                    </Card>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}>
                                    <Card withBorder radius="md" p="md" className="timeline-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">El Amor Creció</Text>
                                        <Text size="sm" c="dimmed">
                                            Aventuras por toda la isla, cenas románticas, y miles de momentos que construyeron nuestro amor día a día.
                                        </Text>
                                    </Card>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}>
                                    <Card withBorder radius="md" p="md" className="timeline-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">La Propuesta</Text>
                                        <Text size="sm" c="dimmed">
                                            En la playa de Flamenco, Culebra, con el atardecer más hermoso como telón de fondo, me arrodillé y le pedí que fuera mi esposa.
                                        </Text>
                                    </Card>
                                </motion.div>
                            </SimpleGrid>

                            <motion.div initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.7 }}>
                                <Text size="lg" ta="center" c="#243e5a" fw={500} className="historia-conclusion">
                                    Y ahora, queremos que seas parte de la siguiente página de nuestra historia...
                                </Text>
                            </motion.div>
                        </Stack>
                    </Card>
                </motion.section>
            )}

            {/* Seccion galeria: fotos de nosotros */}
            {section === "galeria" && (
                <motion.section className='rsvp-gallery-section'>
                    <motion.div initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}>
                        <h2 className='rsvp-title'>Galería de fotos</h2>
                        <Text size='md' c="white" ta="center" mb="lg">
                            Una selección de nuestros momentos favoritos ❤️
                        </Text>
                        {loadingImages && loadedImages.length === 0 && (
                            <Text size="sm" c="dimmed" ta="center" mb="md">
                                Cargando fotos...
                            </Text>
                        )}
                    </motion.div>
                    
                    {loadedImages.length > 0 && (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {loadedImages.map((src, index) => (
                                <motion.div
                                    key={src}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(index * 0.05, 1) }}
                                    className="gallery-item"
                                >
                                    <img
                                        src={src}
                                        alt={`Photo ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        style={{ 
                                            width: '100%', 
                                            display: 'block', 
                                            marginBottom: '16px', 
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: '#f0f0f0'
                                        }}
                                        onLoad={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            img.style.backgroundColor = 'transparent';
                                        }}
                                        onClick={() => {
                                            setSelectedImage(src);
                                            setImageModalOpen(true);
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </Masonry>
                    )}
                    
                    <motion.div initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{ textAlign: 'center', marginTop: '2rem' }}>
                        {loadingImages && (
                            <Text size="sm" c="dimmed" mb="sm">
                                Cargando {loadedImages.length} de {Object.keys(imageModules).length} fotos...
                            </Text>
                        )}
                        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                            Haz clic en cualquier foto para ampliarla
                        </Text>
                    </motion.div>
                </motion.section>
            )}
                 
            {/* --- SECCIÓN 3 (FORMAS DE AYUDA) --- */}
            {section === "ayudanos" && (
                <motion.section className="rsvp-section">
                    {/* Hero Image Section */}
                    <motion.div initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }} className="support-hero">
                        <div className="support-hero-container">
                            <div className="support-hero-image-wrapper">
                                <Image src="/images/_MG_4681.jpeg" alt="Ángel & Mariana" className="support-hero-image" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Support Options Section */}
                    <motion.div initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}>
                        <Card radius="md" withBorder className='support-card'>
                            <Stack gap="lg" align="center">
                                <div className="support-header">
                                    <IconHeart size={40} color="#88a9c3" />
                                    <h2 className='rsvp-title'>¿Cómo nos puedes apoyar?</h2>
                                    <Text size="lg" c="dimmed" ta="center" className="support-description">
                                        Si deseas dejar tu huella y formar parte de esta nueva aventura, 
                                        puedes hacerlo a través de las siguientes opciones:
                                    </Text>
                                </div>

                                <Divider w="100%" color="#88a9c3" />

                                <Stack gap="md" className="support-options">
                                    {/* Ath Móvil Section */}
                                    <motion.div initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}>
                                        <Card withBorder radius="md" p="md" className="support-option-card">
                                            <Group align="center" gap="md" wrap="nowrap">
                                                <Image src="/images/athmovil.png" alt="Ath Móvil" className="support-option-icon" />
                                                <Stack gap="xs" style={{ flex: 1 }}>
                                                    <Text fw={600} size="lg" c="#243e5a">Ath Móvil</Text>
                                                    <Text size="sm" c="dimmed">Envía tu contribución directamente</Text>
                                                    <Stack gap="xs">
                                                        <Group gap="xs" align="center">
                                                            <Text fw={500} size="md">Ángel: (787) 710-1934</Text>
                                                            <Tooltip label={copiedItems.angel ? "¡Copiado!" : "Copiar número"}>
                                                                <ActionIcon
                                                                    variant="subtle"
                                                                    color={copiedItems.angel ? "green" : "gray"}
                                                                    onClick={() => copyToClipboard("(787) 710-1934", "angel")}
                                                                >
                                                                    {copiedItems.angel ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Group>
                                                        <Group gap="xs" align="center">
                                                            <Text fw={500} size="md">Mariana: (787) 690-2236</Text>
                                                            <Tooltip label={copiedItems.mariana ? "¡Copiado!" : "Copiar número"}>
                                                                <ActionIcon
                                                                    variant="subtle"
                                                                    color={copiedItems.mariana ? "green" : "gray"}
                                                                    onClick={() => copyToClipboard("(787) 690-2236", "mariana")}
                                                                >
                                                                    {copiedItems.mariana ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Group>
                                                    </Stack>
                                                </Stack>
                                            </Group>
                                        </Card>
                                    </motion.div>

                                    {/* PayPal Section */}
                                    <motion.div initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}>
                                        <Card withBorder radius="md" p="md" className="support-option-card">
                                            <Group align="center" gap="md" wrap="nowrap">
                                                <Image src="/images/paypal.png" alt="PayPal" className="support-option-icon" />
                                                <Stack gap="xs" style={{ flex: 1 }}>
                                                    <Text fw={600} size="lg" c="#243e5a">PayPal</Text>
                                                    <Text size="sm" c="dimmed">Contribución internacional</Text>
                                                    <Group gap="xs" align="center">
                                                        <Text fw={500} size="md">@agabrielrr0</Text>
                                                        <Tooltip label={copiedItems.paypal ? "¡Copiado!" : "Copiar usuario"}>
                                                            <ActionIcon
                                                                variant="subtle"
                                                                color={copiedItems.paypal ? "green" : "gray"}
                                                                onClick={() => copyToClipboard("@agabrielrr0", "paypal")}
                                                            >
                                                                {copiedItems.paypal ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                                                            </ActionIcon>
                                                        </Tooltip>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="blue"
                                                            component="a"
                                                            href="https://www.paypal.com/paypalme/agabrielrr0"
                                                            target="_blank"
                                                        >
                                                            <IconExternalLink size="1rem" />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                            </Group>
                                        </Card>
                                    </motion.div>

                                    {/* Amazon Wishlist Section */}
                                    <motion.div initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}>
                                        <Card withBorder radius="md" p="md" className="support-option-card">
                                            <Group align="center" gap="md" wrap="nowrap">
                                                <Image src="/images/amazon.png" alt="Amazon Wishlist" className="support-option-icon" />
                                                <Stack gap="xs" style={{ flex: 1 }}>
                                                    <Text fw={600} size="lg" c="#243e5a">Amazon Wishlist</Text>
                                                    <Text size="sm" c="dimmed">Regalos que necesitamos para nuestro hogar</Text>
                                                    <Group gap="xs" align="center">
                                                        <Text fw={500} size="md">Ver lista de deseos</Text>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="orange"
                                                            component="a"
                                                            href="https://www.amazon.com/hz/wishlist/ls/3BTN6FLFZUUN1?ref_=wl_share"
                                                            target="_blank"
                                                        >
                                                            <IconExternalLink size="1rem" />
                                                        </ActionIcon>
                                                    </Group>
                                                </Stack>
                                            </Group>
                                        </Card>
                                    </motion.div>

                                    {/* Additional Support Options */}
                                    <motion.div initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}>
                                        <Card withBorder radius="md" p="md" className="support-option-card additional-support">
                                            <Stack gap="md" align="center">
                                                <IconGift size={32} color="#88a9c3" />
                                                <Text fw={600} size="lg" c="#243e5a" ta="center">Otras formas de apoyar</Text>
                                                <Text size="sm" c="dimmed" ta="center">
                                                    Tu presencia en nuestra boda es el mejor regalo. Si deseas contribuir de otra manera, 
                                                    contáctanos directamente.
                                                </Text>
                                                <Group gap="sm" wrap="nowrap">
                                                    <Button
                                                        variant="outline"
                                                        leftSection={<IconPhone size="1rem" />}
                                                        component="a"
                                                        href="tel:+17877101934"
                                                        size="sm"
                                                    >
                                                        Llamar a Ángel
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        leftSection={<IconPhone size="1rem" />}
                                                        component="a"
                                                        href="tel:+17876902236"
                                                        size="sm"
                                                    >
                                                        Llamar a Mariana
                                                    </Button>
                                                </Group>
                                            </Stack>
                                        </Card>
                                    </motion.div>
                                </Stack>

                                <Divider w="100%" color="#88a9c3" />

                                {/* Thank You Section */}
                                <motion.div initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: 0.7 }}>
                                    <Stack gap="md" align="center">
                                        <Image src="/images/small-gold-flower.png" alt="flor dorada" w={60} />
                                        <Text ta="center" className='rsvp-thank-you'>¡Gracias por tu apoyo!</Text>
                                        <Text size="sm" c="dimmed" ta="center" style={{ fontStyle: 'italic' }}>
                                            Cada contribución, por pequeña que sea, nos ayuda a hacer realidad nuestros sueños
                                        </Text>
                                    </Stack>
                                </motion.div>
                            </Stack>
                        </Card>
                    </motion.div>
                </motion.section>
            )}

            {/* Admin Panel Modal */}
            <Modal
                opened={adminModalOpen}
                onClose={() => setAdminModalOpen(false)}
                title="Panel de Administración - Lista de Invitados"
                size="xl"
            >
                <Stack gap="md">
                    <Group justify="space-between">
                        <Text size="lg" fw={600}>
                            Confirmaciones: {guestList.filter(g => g.isConfirmed).length} / {guestList.length}
                        </Text>
                        <Group gap="sm">
                            <Button
                                leftSection={<IconDownload size="1rem" />}
                                onClick={exportGuestData}
                                size="sm"
                            >
                                Exportar
                            </Button>
                        </Group>
                    </Group>

                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Nombre</Table.Th>
                                <Table.Th>Familia</Table.Th>
                                <Table.Th>Estado</Table.Th>
                                <Table.Th>Fecha</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {guestList.map((guest) => (
                                <Table.Tr key={guest.id}>
                                    <Table.Td>
                                        <Text fw={500}>{guest.name}</Text>
                                        {guest.email && (
                                            <Text size="xs" c="dimmed">{guest.email}</Text>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">
                                            {guest.family.length > 0 
                                                ? `${guest.family.length} miembro(s)`
                                                : `Solo`
                                            }
                                        </Text>
                                        {guest.family.length > 0 && (
                                            <Text size="xs" c="dimmed">
                                                {guest.family.map(f => f.name).join(', ')}
                                            </Text>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge 
                                            color={guest.isConfirmed ? 'green' : 'gray'}
                                            variant="light"
                                        >
                                            {guest.isConfirmed ? 'Confirmado' : 'Pendiente'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {guest.confirmationDate ? (
                                            <Text size="sm">
                                                {new Date(guest.confirmationDate).toLocaleDateString('es-ES')}
                                            </Text>
                                        ) : (
                                            <Text size="sm" c="dimmed">-</Text>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {guestList.filter(g => g.isConfirmed).length > 0 && (
                        <Card withBorder p="md">
                            <Text fw={600} mb="sm">Detalles de Confirmaciones:</Text>
                            <Stack gap="xs">
                                {guestList.filter(g => g.isConfirmed).map((guest) => (
                                    <div key={guest.id}>
                                        <Text size="sm" fw={500}>{guest.name}</Text>
                                        {guest.dietaryRestrictions && (
                                            <Text size="xs" c="dimmed">
                                                Restricciones: {guest.dietaryRestrictions}
                                            </Text>
                                        )}
                                        {guest.message && (
                                            <Text size="xs" c="dimmed">
                                                Mensaje: {guest.message}
                                            </Text>
                                        )}
                                    </div>
                                ))}
                            </Stack>
                        </Card>
                    )}
                </Stack>
            </Modal>

            {/* Image Viewer Modal */}
            <Modal
                opened={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                size="xl"
                centered
                padding={0}
                withCloseButton={false}
                styles={{
                    body: {
                        padding: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    },
                    content: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                    header: {
                        backgroundColor: 'transparent',
                    }
                }}
            >
                <div style={{ position: 'relative', width: '100%', minHeight: '50vh' }}>
                    <img
                        src={selectedImage}
                        alt="Vista completa"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            display: 'block',
                            borderRadius: '8px'
                        }}
                    />
                    <ActionIcon
                        size="lg"
                        radius="xl"
                        variant="filled"
                        color="dark"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#000',
                            zIndex: 1000
                        }}
                        onClick={() => setImageModalOpen(false)}
                    >
                        <IconX size="1.5rem" />
                    </ActionIcon>
                </div>
            </Modal>
        </SimpleGrid>

        {/* Admin Modal */}
        <Modal
            opened={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            size="xl"
            title="Panel de Administración"
            centered
        >
            <Stack gap="md">
                <Text size="lg" fw={600} c="#243e5a">Lista de Invitados</Text>
                
                <Group>
                    <Button
                        leftSection={<IconDownload size="1rem" />}
                        onClick={exportGuestData}
                        variant="light"
                    >
                        Exportar Lista
                    </Button>
                    
            
                </Group>

                <Divider />

                <Card withBorder p="md">
                    <Text fw={600} mb="sm">Resumen:</Text>
                    <Text size="sm">Total de invitados: {guestList.length}</Text>
                    <Text size="sm">Confirmados: {guestList.filter(g => g.isConfirmed).length}</Text>
                    <Text size="sm">Pendientes: {guestList.filter(g => !g.isConfirmed).length}</Text>
                </Card>

                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Estado</Table.Th>
                            <Table.Th>Familia</Table.Th>
                            <Table.Th>Contacto</Table.Th>
                            <Table.Th>Fecha</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {guestList.map((guest) => (
                            <Table.Tr key={guest.id}>
                                <Table.Td>{guest.name}</Table.Td>
                                <Table.Td>
                                    {guest.isConfirmed ? (
                                        <Badge color="green" variant="light">Confirmado</Badge>
                                    ) : (
                                        <Badge color="gray" variant="light">Pendiente</Badge>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    {guest.family.length > 0 ? (
                                        <Text size="sm">{guest.family.length} miembro(s)</Text>
                                    ) : (
                                        <Text size="sm" c="dimmed">Sin familia</Text>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    {guest.email && <Text size="xs">{guest.email}</Text>}
                                    {guest.phone && <Text size="xs">{guest.phone}</Text>}
                                </Table.Td>
                                <Table.Td>
                                    {guest.confirmationDate ? (
                                        <Text size="xs">
                                            {moment(guest.confirmationDate).format('DD/MM/YYYY HH:mm')}
                                        </Text>
                                    ) : (
                                        <Text size="xs" c="dimmed">-</Text>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {guestList.filter(g => g.isConfirmed).length > 0 && (
                    <Card withBorder p="md">
                        <Text fw={600} mb="sm">Detalles de Confirmaciones:</Text>
                        <Stack gap="xs">
                            {guestList.filter(g => g.isConfirmed).map((guest) => (
                                <div key={guest.id}>
                                    <Text size="sm" fw={500}>{guest.name}</Text>
                                    {guest.dietaryRestrictions && (
                                        <Text size="xs" c="dimmed">
                                            Restricciones: {guest.dietaryRestrictions}
                                        </Text>
                                    )}
                                    {guest.message && (
                                        <Text size="xs" c="dimmed">
                                            Mensaje: {guest.message}
                                        </Text>
                                    )}
                                </div>
                            ))}
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Modal>
        </>
    );
}

export default RSVP;
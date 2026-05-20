import { Card, Text, Button, Group, SimpleGrid, Image, Stack, Textarea, Alert, ActionIcon, Tooltip, Divider, Select, Checkbox, Modal, Table, Badge, type OptionsFilter, type ComboboxItem, Flex, Box, Accordion, PasswordInput } from '@mantine/core';
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { IconCheck, IconAlertCircle, IconCopy, IconExternalLink, IconHeart, IconGift, IconPhone, IconDownload, IconX, IconClockHour4, IconUpload, IconArrowRight, IconPhoto, IconCalendar, IconBuildingChurch, IconParking, IconConfetti, IconCancel, IconCameraUp, IconBook, IconShirt, IconArrowNarrowLeft, IconCalendarCheck, IconClock, IconHash, IconZoomQuestion, IconHomeHeart, IconAvocado, IconMessage} from '@tabler/icons-react';
import { createEvents, type DateArray } from 'ics';
import { Dropzone } from '@mantine/dropzone';
import type {DropzoneProps, FileWithPath} from '@mantine/dropzone';


import Masonry from "react-masonry-css";
import './RSVP.css'

import NavBar from "./NavBar";
import Footer from './Footer';
import Countdown from './Countdown';
import { Carousel } from './Carousel';

import { VestimentaCarousel } from './VestimentaCarousel';

// Guest data types
interface FamilyMember {
    id: string;
    name: string;
    isConfirmed: boolean;
    isDeclined: boolean;
}

interface Guest {
    id: string;
    name: string;
    isConfirmed: boolean;
    isDeclined: boolean;
    optionalMessage: string;
    family: FamilyMember[];
}

function RSVP(props: Partial<DropzoneProps>) {

    // State to manage the current section
    const [section, setSection] = useState<"rsvp" | "upload" | "vestimenta" | "historia" | "galeria" | "ayudanos" | "qa" | "2">("rsvp");
    
    // Admin state
    const [adminLoginOpen, setAdminLoginOpen] = useState(false);
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [adminPasscode, setAdminPasscode] = useState('');
    const [adminError, setAdminError] = useState('');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    const handleAdminAccess = () => {
        const ADMIN_PASSCODE = "julio112026";

        if (adminPasscode === ADMIN_PASSCODE) {
            setIsAdminAuthenticated(true);
            setAdminLoginOpen(false);
            setAdminModalOpen(true);
            setAdminError('');
            setAdminPasscode('');
        } else {
            setAdminError('Contraseña inválida');
        }
    };
    // Function to handle admin modal close and reset authentication state
    const handleAdminClose = () => {
        setAdminModalOpen(false);
        setIsAdminAuthenticated(false);
        setAdminPasscode('');
        setAdminError('');
    };

    // Guest management state 
    const [guestList, setGuestList] = useState<Guest[]>([]);

    useEffect(() => {
        const loadGuests = async () => {
            try {
                const APIBASE = import.meta.env.PROD ? '' : 'http://localhost:3001';
                const res = await fetch(`${APIBASE}/api/guests`);
                if (!res.ok) throw new Error('Failed to load guests');
                const data = await res.json();
                setGuestList(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadGuests();
    }, []);

    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<string[]>([]);


    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        family: 0,
        optionalMessage: ''
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
             
        setFormErrors(errors);
        console.log(formErrors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const submitRSVP = async (status: 'confirm' | 'decline') => {
        if (!selectedGuest) return;
        if (!validateForm()) return;

        setIsSubmitting(true);

        const updatedGuest = {
            ...selectedGuest,
            isConfirmed: status === 'confirm',
            isDeclined: status === 'decline',
            confirmationDate: new Date().toISOString(),
            optionalMessage: formData.optionalMessage,
        };

        try {
            const APIBASE = import.meta.env.PROD ? '' : 'http://localhost:3001';
            const res = await fetch(`${APIBASE}/api/guests/${selectedGuest.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedGuest),
            });

            if (!res.ok) throw new Error('Failed to save guest');

            const savedGuest = await res.json();

            setGuestList(prev =>
                prev.map(g => (g.id === savedGuest.id ? savedGuest : g))
            );

            setSelectedGuest(savedGuest);
            setSubmitStatus('success');
        } catch (err) {
            console.error(err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear the form and return to rsvp page
    const handleCloseSuccess = () => {
        setFormData({
            name: '',
            family: 0,
            optionalMessage: '',
        });
        setSelectedGuest(null);
        setSelectedFamilyMembers([]);
        setSubmitStatus('idle');
    };

    // Regex to allow search for accents
    const filterGuests: OptionsFilter = ({ options, search }) => {
        const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        const searchNorm = normalize(search);

        return (options as ComboboxItem[]).filter(option =>
            normalize(option.label).includes(searchNorm)
        );
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
    
    const openDetails = () => {

    }

    // Function to add wedding event to the calendar
    const saveCalendar = () => {
        const ceremonyDate = new Date('2026-07-11T13:00:00');  // 1:00 PM local
        const receptionDate = new Date('2026-07-11T17:30:00');  // 5:30 PM local

        createEvents([
            {
                title: 'Boda Ángel & Mariana',
                start: [ceremonyDate.getFullYear(), ceremonyDate.getMonth() + 1, ceremonyDate.getDate(), ceremonyDate.getHours(), ceremonyDate.getMinutes()] as DateArray,
                end: [receptionDate.getFullYear(), receptionDate.getMonth() + 1, receptionDate.getDate(), receptionDate.getHours(), receptionDate.getMinutes()] as DateArray,
                description: 'Este evento fue creado para la ceremonia a las 1:00 PM, Recepción a las 5:30 PM en Zafra del Caribe en Gurabo. Vestimenta formal. Estacionamiento debajo de la parroquia y en el centro comercial.',
                location: 'https://maps.app.goo.gl/iqj1iCJ3BLC2dbQo9',
                alarms: [
                    {
                        trigger: '-P1W',
                        action: 'display',
                        description: 'Boda Ángel & Mariana'
                    }
                ]
            }
        ], (error, value) => {
            if (error) {
                console.error(error);
                return;
            }
            const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Angel&Mariana-11-julio-2026.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    };

    // Upload photos to mega.nz folder (send them to api)
    const [files, setFiles] = useState<FileWithPath[] | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleClear = () => setFiles(null);

    const previews = useMemo(() => {
        if (!files) return null;

        const toShow = files.slice(0, 3); // max 4 in stack

        return (
            <Box
                w={220}
                h={220}
                style={{
                    position: 'relative',
                    marginInline: 'auto',
                    margin: '3rem'
                }}
            >
                {toShow.map((file, index) => {
                    const imageUrl = URL.createObjectURL(file);

                    // tweak these values to taste
                    const offsets = [
                        { top: 4, left: 0, rotate: -8 },
                        { top: 8, left: 5, rotate: -3 },
                        { top: 16, left: 10, rotate: 4 },
                    ];
                    const { top, left, rotate } = offsets[index] ?? offsets[offsets.length - 1];

                    return (
                        <Box
                            key={index}
                            style={{
                                position: 'absolute',
                                top,
                                left,
                                width: '100%',
                                height: '100%',
                                transform: `rotate(${rotate}deg)`,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                                overflow: 'hidden',
                                backgroundColor: 'black',
                            }}
                        >
                            <Image
                                src={imageUrl}
                                alt={`preview-${index}`}
                                width="100%"
                                height="100%"
                                fit="cover"
                                onLoad={() => URL.revokeObjectURL(imageUrl)}
                            />
                        </Box>
                    );
                })}
            </Box>
        );
    }, [files]);

    const uploadPhotos = async () => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        files.forEach((file => {
            formData.append('photos', file);
        }))

        console.log(formData);

        try {
            setUploading(true);
            const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';
            const res = await fetch(`${API_BASE}/api/upload-photos`, {
                method: 'POST',
                body: formData
            });

            if(!res.ok){
                console.log(res);
                throw new Error('Upload failed');
            }else {
                const data = await res.json();
                console.log("Uploaded to mega succesfully", data)
                setFiles(null);
                // TODO: Fix this alert message here not showing up
                return(
                    <Alert color="green" title="Uploaded to mega succesfully">Uploaded {data.files.length} photos to mega succesfully</Alert>
                );
            }

        } catch(e) {
            console.log(e);
        } finally {
            setUploading(false);
        }
    }

    // Scroll to top functionality
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [section]);

    const handleGuestSelection = (guestId: string) => {
        const guest = guestList.find(g => g.id === guestId);
        if (guest) {
            setSelectedGuest(guest);
            setFormData({
                name: guest.name,
                family: guest.family.length,
                optionalMessage: guest.optionalMessage || ''
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

    const breakpointColumnsObj = {
        default: 4,
        1100: 4,
        700: 3,
        500: 2
    };

    // Import all the images from the assets folder for the gallery (lazy loaded)
    const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', { eager: false });
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
                const importFns = Object.values(imageModules) as (() => Promise<{ default: string }>)[];
                const imagePromises = importFns.map(fn => fn());

                const batchSize = 8;
                const results: string[] = [];

                for (let i = 0; i < imagePromises.length; i += batchSize) {
                    const batchModules = await Promise.all(imagePromises.slice(i, i + batchSize));
                    const batchSrcs = batchModules.map(m => m.default);
                    results.push(...batchSrcs);
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
                <NavBar
                    section={section}
                    setSection={setSection}
                    onAdminClick={() => {
                        setAdminPasscode('');
                        setAdminError('');
                        setAdminLoginOpen(true);
                    }}
                />

            {/* --- SECCIÓN 1 (Home) --- */}
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
                            <Stack gap="sm" align="center">
                                <div className="hero-text-section">
                                    <h1 className='hero-title'>Ángel & Mariana</h1>
                                    <Text size="lg" c="#243e5a" fw={400} ta="center" className="hero-subtitle">
                                        11 de Julio de 2026  💍  San Juan, PR
                                    </Text>
                                </div>
                                <Image radius="lg" w="auto" h={500} src='/images/us2.jpg' alt='Ángel & Mariana' className='hero-photo'/>
                            
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

                            <h3 className='rsvp-subtitle'>¡Confirma tu asistencia!</h3>

                            <Stack gap="sm" className="wedding-details">
                                <Card withBorder radius="md" p="md" className="detail-card">
                                    <Stack gap='sm'>
                                            <Text fw={600} size="lg" c="#243e5a">
                                                <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                                    <IconCalendar size='1.2rem' style={{ marginLeft: 6, verticalAlign: 'middle'}}/> 
                                                    <span>Fecha y Hora</span>
                                                </Group>
                                                </Text>
                                        <Text size="md">Sábado, 11 de Julio de 2026 - 1:00 PM</Text>
                                            <Button 
                                                size="sm" 
                                                className='rsvp-button' 
                                                onClick={() => {
                                                    saveCalendar()
                                                }}>
                                                <Text size="sm"> 
                                                    <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                                        <span>Añadir a calendario</span>
                                                        <IconDownload size="1rem" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                                                    </Group>
                                                </Text>
                                            </Button>
                                    </Stack>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">
                                            <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                                <IconBuildingChurch size='1.2rem' style={{ marginLeft: 6, verticalAlign: 'middle'}}/>
                                                <span>Ceremonia</span>
                                            </Group>
                                            </Text>
                                    <Text size="md" component="a" href="https://maps.app.goo.gl/iqj1iCJ3BLC2dbQo9" c='#88a9c3'>
                                        <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                            <span>120 Calle Blvd de la Fuente, San Juan, 00926 </span>
                                            <IconExternalLink size="1rem" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                                        </Group>
                                    </Text>
                                    <Text size="sm" c="dimmed" mt="xs">Iglesia San Juan de la Cruz</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">
                                            <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                                <IconConfetti size='1.2rem' style={{ marginLeft: 6, verticalAlign: 'middle' }} /> 
                                                <span>Recepción</span>
                                            </Group>
                                            </Text>
                                    <Text size="md" component="a" href="https://maps.app.goo.gl/6CXjuRubJbq98fji6" c='#88a9c3'>
                                        <Group gap={6} wrap="nowrap" align="center" justify='center' >
                                            <span>Carretera PR 189, Km. 5.3, Gurabo, 00778</span>
                                            <IconExternalLink size="1rem" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                                    </Group>
                                    </Text>
                                    <Text size="sm" c="dimmed" mt="xs">Zafra del Caribe</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">
                                            <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                                <IconParking size='1.2rem' style={{ marginLeft: 6, verticalAlign: 'middle' }} /> 
                                                <span> Estacionamiento</span>
                                            </Group>
                                        </Text>
                                    <Text size="md">Disponible en ambos lugares</Text>
                                    <Text size="sm" c="dimmed">Debajo de la parroquia y frente al centro comercial. 
                                        En la recepción también habrá estacionamiento.</Text>
                                </Card>

                                <Card withBorder radius="md" p="md" className="detail-card">
                                        <Text fw={600} size="lg" c="#243e5a" mb="sm">
                                            <Group gap={6} wrap="nowrap" align="center" justify='center'>
                                                <IconPhone size="1.2rem" style={{ marginLeft: 6, verticalAlign: 'middle' }}/>
                                                <span>Contacto</span>
                                            </Group>
                                        </Text>
                                    <Text size="md">¿Preguntas? Contáctanos:</Text>
                                        <Text size="sm" c="#243e5a" fw={500}>Ángel: <a href="tel:7877101934">(787) 710-1934</a></Text>
                                        <Text size="sm" c="#243e5a" fw={500}>Mariana: <a href="tel:7876902236">(787) 690-2236</a></Text>
                                </Card>
                            </Stack>

                            <Button
                                className="rsvp-button"
                                mt="lg"
                                size="lg"
                                radius='sm'
                                onClick={() => {
                                    setSection("2");
                                    scrollToTop();
                                }}>
                                    Confirmar Asistencia <IconArrowRight size={20} style={{ marginLeft: 4 }} />
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
                                variant="outline"
                                size="xs"
                                className="rsvp-back-button"
                                color='#243e5a'
                                onClick={() => {
                                    setSection("rsvp");
                                    handleCloseSuccess();
                                }}
                            >
                                <IconArrowNarrowLeft size="18px" /> 
                            </Button>

                            <div className="rsvp-header">
                                <Text className="hero-title" mt="lg" mb="ms">RSVP</Text>
                                <IconCalendarCheck size="2rem" style={{color:"#243e5a", marginBottom: "15px"}}/>
                                <Text size="xs" c="dimmed" className="rsvp-description">
                                    Confirma tu asistencia a nuestra boda. ¡Nos encantaría contar contigo!
                                </Text>
                            </div>

                            <hr className="rsvp-divider" />

                            {submitStatus === 'success' ? (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}>
                                    <Alert icon={<IconCheck size="1rem" />} title="Se ha registrado su respuesta." color="green" variant="light"></Alert>
                                    <br/>
                                    <Group align="center" gap="md" wrap="wrap" className='alert-group'>
                                        <Button
                                            size="sm"
                                            onClick={handleCloseSuccess}>
                                            Volver
                                        </Button>
                                        <Button
                                            size="sm"
                                            className='rsvp-button'
                                            onClick={() => {
                                                saveCalendar()
                                            }}>
                                            <Text size="sm">
                                                Añadir al calendario
                                                <IconDownload size="1rem" style={{ marginLeft: 4 }} />
                                            </Text>
                                        </Button>
                                    </Group>
                                </motion.div>
                            ) : (
                                <form autoComplete="off">
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
                                            filter={filterGuests}
                                            required
                                            size="md"
                                        />

                                        {selectedGuest && !selectedGuest.isConfirmed && selectedGuest.family.length > 0 && (
                                            <div>
                                                <Alert color="blue" variant="light" className='form-alert'>
                                                    <Text size="sm"> Selecciona los miembros de tu familia que asistirán:</Text>
                                                </Alert>
                                                <Stack gap="xs">
                                                    {selectedGuest.family.map((member) => (
                                                        <div>
                                                            <Checkbox
                                                                key={member.id}
                                                                label={`${member.name}`}
                                                                checked={selectedFamilyMembers.includes(member.id)}
                                                                onChange={() => handleFamilyMemberToggle(member.id)}
                                                            />
                                                            {/* TODO: añadir la opcion de que cada miembro pueda añadir restriccion alimenticia (no todos tienen que tener) */}
                                                            {/* <Textarea
                                                                label="Restricciones Alimentarias (Optional)"
                                                                placeholder="Alergias, vegetarianismo, etc."
                                                                value={formData.food}
                                                                onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                                                                size="md"
                                                                minRows={2}
                                                            /> */}
                                                        </div>
                                                    ))}
                                                </Stack>
                                            </div>
                                        )}

                                        {/* <Textarea
                                            label="Restricciones Alimentarias (Opcional)"
                                            placeholder="Alergias, vegetarianismo, etc."
                                            value={formData.food}
                                            onChange={(e) => setFormData({...formData, food: e.target.value})}
                                            size="md"
                                            minRows={2}
                                        /> */}

                                        <Textarea
                                            label="Mensaje para los novios (Opcional)"
                                            placeholder="¡Déjanos un mensaje especial!"
                                            value={formData.optionalMessage}
                                            onChange={(e) => setFormData({...formData, optionalMessage: e.target.value})}
                                            size="md"
                                            minRows={4}
                                        />

                                        {submitStatus === 'error' && (
                                                <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="rgb(237, 51, 51)" variant="light">
                                                <Text size="sm">
                                                    Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.
                                                </Text>
                                            </Alert>
                                        )}
                                        <Group align="center" justify="center" gap="md" mt="5" wrap="nowrap">
                                            <Button  
                                                radius="sm" 
                                                type="submit" 
                                                color='red'
                                                variant='light'
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                onClick={() => submitRSVP('decline')}>
                                                    Declinar <IconX size="20" style={{marginLeft: 4}}/> 
                                            </Button>
                                            <Button   
                                                radius="sm" 
                                                type="submit" 
                                                color="green"
                                                variant='light'
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                onClick={() => submitRSVP('confirm')}
                                            >
                                                    Confirmar <IconCheck size="20" style={{ marginLeft: 4 }} />
                                            </Button>
                                        </Group>
                                    </Stack>
                                </form>
                            )}
                        </Card>
                </motion.section>
            )}

            {/* SECCION UPLOAD PHOTOS */}
            {section === "upload" && (
                    <motion.section initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }} className='rsvp-section'>
                    <Card withBorder radius="md" className='upload-card' >
                        <Flex gap="lg" justify="center" align="center" direction='column'>
                            <Text className='hero-title' mx="sm" my="0">Dale Upload A Tus Fotos</Text>
                                <IconCameraUp color="#243e5a" size="2rem" />
                            {files && (<ActionIcon
                                variant="light"
                                color="red"
                                size="lg"
                                radius="xl"
                                style={{ alignSelf: 'center' }}
                                onClick={handleClear}
                            >
                                <IconX size="1.2rem" />
                            </ActionIcon>)}
                            <Dropzone
                                onDrop={(value) => {
                                    setFiles(value as File[] | null);
                                }}
                                accept={{'image/*': [],
                                         'video/*': [],
                                }}
                                multiple
                                style={{ border: '1px dashed #243e5a' }}
                                className='dropzone-group'
                                {...props}
                            > {!files ? 
                                <Group justify="center" gap="1" mih={220} style={{ pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
                                    </Dropzone.Idle>
                                    <div>
                                        <Text size="l" inline>
                                            Arrastra las fotos o haz click para escogerlas
                                        </Text>
                                        <Text size="sm" c="dimmed" inline mt={7}>
                                            Comparte tus fotos tomadas el día de la boda
                                        </Text>
                                    </div>
                                </Group> 
                                    : <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {previews}
                                        {files.length > 3 && (
                                            <Text size="sm" c="dimmed" style={{textAlign: 'center'}}>
                                                +{files.length - 3} fotos adicionales
                                            </Text>
                                        )}
                                    </div>
                                }
                            </Dropzone>
                            <Group>
                                <Button className='album-btn' onClick={() => window.open("https://mega.nz/folder/m9QhFKhA#h37UmnjnRLJSAZjH199YWg")}>Ver álbum <IconExternalLink size="16" style= {{marginLeft: 4}}/></Button>
                                <Button className='upload-btn' type='submit' onClick={uploadPhotos} loading={uploading} disabled={!files || files.length === 0}> Subir <IconUpload size="13" style={{ marginLeft: 4 }} /></Button>
                            </Group>
                        </Flex>
                    </Card>
                    </motion.section>
            )}


            {/* --- SECCIÓN CÓDIGO DE VESTIMENTA --- */}
            {section === "vestimenta" && (
                    <motion.section initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }} className="rsvp-section">                        
                        <Card withBorder radius="md" className="vestimenta-wrapper" ta="center" mb="md">
                            <Text className='hero-title' mt="lg">Vestimenta Formal</Text>
                            <VestimentaCarousel />
                        </Card>
                        <Flex align='center' justify='center' direction='column'>
                            <Card withBorder radius="md" p="md" mb='md' className='colores-card'>
                                <Text className='rsvp-subtitle' ta='center'>
                                    Colores del séquito:
                                </Text>
                                <Group align='center' justify='center' ta='center'>
                                    <Flex gap='sm' className='colores'>
                                        <span style={{ height: '65px', width: '65px', background: '#343853', color: '#fff', borderRadius: '50%', textAlign: 'center', alignContent: 'center' }}>Slate</span>
                                        <span style={{ height: '65px', width: '65px', background: '#466d92', color: '#fff', borderRadius: '50%', textAlign: 'center', alignContent: 'center' }}>Twilight</span>
                                        <span style={{ height: '65px', width: '65px', background: '#bdc6d9', color: '#fff', borderRadius: '50%', textAlign: 'center', alignContent: 'center' }}>Dusty</span>
                                    </Flex>
                                    <Group justify='center' ta='center'>

                                    <Text size='md' c='#88a9c3' ta='center'>Código de vestimenta: Formal</Text>
                                    <Text size='sm' c='dimmed' ta='center' className='colores-nota'> Estos son los colores de la boda y del séquito, pero siéntanse en total libertad de usar lo que les haga sentir más cómodos.</Text>
                                    </Group>
                                </Group>
                                
                            </Card>
                        </Flex>
                </motion.section>
            )}

            {/* --- SECCIÓN HISTORIA --- */}
            {section === "historia" && (
                <motion.section initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }} className="rsvp-section">
                    <Card radius="md" withBorder className='rsvp-card'>
                        <Text className='rsvp-title' mb="0">Nuestra historia</Text>
                        <Stack className="historia-content">
                            <motion.div initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.2 }}>
                                    <IconBook color="#88a9c3" size="2rem"/>
                                <Text size="lg" ta="center" c="dimmed" className="historia-text">
                                    Momentos importantes en nuestra vida como novios 
                                </Text>
                            </motion.div>
                            <Carousel />
                            <Text className='save-the-date-title' mb='xs' mt='md'>---- Save The Date ----</Text>
                            <div className="video-container">
                                <iframe
                                    className="responsive-iframe"
                                    src="https://www.youtube.com/embed/52bimU_hj9s"
                                    title="Save the Date"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <Card mt="lg">
                                    <Text className='save-the-date-title' mb='xs' mt='md'>Invitación</Text>
                                    {/* todo Aquí la invitacion */}
                            </Card>
                            <motion.div initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.7 }}>
                                <Text size="md" ta="center" c="#243e5a" fw={500} className="historia-conclusion">
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
                        <Card radius="md" withBorder className='support-card'>
                            <Stack gap="lg" align="center">
                                <div className="support-header">
                                    <IconHeart size={40} color="#88a9c3" />
                                    <h2 className='rsvp-title'>¿Cómo nos puedes apoyar?</h2>
                                    <Text size="lg" c="dimmed" ta="center" className="support-description">
                                        Si deseas dejar tu huella y formar parte de esta nueva etapa de nuestra vida, 
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
                                                    <Text fw={600} size="lg" c="#243e5a">ATH Móvil</Text>
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
                                    {/* <motion.div initial={{ opacity: 0, x: -20 }}
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
                                    </motion.div> */}

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

            {/* --- SECCIÓN QA --- */}
            {section === 'qa' && (
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="qa-card"
                >
                    <Card radius="md" withBorder >
                    
                        <Text className="hero-title" mt='lg'>Preguntas Frecuentes</Text>
                        <IconZoomQuestion size="2rem" style={{ color: '#243e5a', marginBottom: '15px', alignSelf:'center' }} />
                        <Text size="xs" c="dimmed" className="rsvp-description">
                            Encuentra respuestas a las preguntas más comunes sobre nuestra boda
                        </Text>
                        <hr className="rsvp-divider" />

                        <Accordion multiple radius="md" className="qa-accordion">
                            <Accordion.Item value="ceremony">
                                <Accordion.Control>
                                    <Group gap="xs" display="flex" dir='row'>
                                        <IconClock size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Cuáles son los horarios exactos?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        <Text fw={500} c="#243e5a" component="span">Ceremonia: </Text>
                                        Sábado, 11 de julio de 2026, 1:00 PM en Iglesia San Juan de la Cruz, SJ.
                                    </Text>
                                    <Text size="sm" mt="xs" c="dimmed">
                                        <Text fw={500} c="#243e5a" component="span">Recepción: </Text>
                                        5:30 PM en Zafra del Caribe, Gurabo.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="dresscode">
                                <Accordion.Control>
                                    <Group gap="xs">
                                        <IconShirt size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Cuál es el código de vestimenta?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        Vestimenta formal. Favor de no ir de blanco, eso es solo para la novia.  
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="in-out">
                                <Accordion.Control>
                                    <Group gap="xs">
                                        {/* todo este icono cambiarlo */}
                                        <IconHomeHeart size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿La boda es en interior o exterior?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        La boda y recepción son en interior.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="parking">
                                <Accordion.Control>
                                    <Group gap="xs">
                                        <IconParking size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Dónde me puedo estacionar?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        <Text fw={500} c="#243e5a" component="span">Ceremonia: </Text>
                                        Debajo de la parroquia y en el centro comercial Galería Paseos cruzando la calle. 
                                    </Text>
                                    <Text size="sm" c="dimmed" mt="xs">
                                        <Text fw={500} c="#243e5a" component="span">Recepción: </Text>
                                        Habrá estacionamientos disponibles también.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="food">
                                <Accordion.Control>
                                        <Group gap="xs" display="flex" dir='row' style={{ textWrap: "wrap" }} wrap='nowrap'>
                                        <IconAvocado size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Qué hago si tengo restricciones alimenticias?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        Comunicate con Ángel o Mariana lo antes posible para coordinar una opción que se ajuste a tus necesidades.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="rsvp">
                                <Accordion.Control>
                                    <Group gap="xs">
                                        <IconCheck size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Hasta cuándo puedo confirmar?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm">
                                        Confirma lo antes posible. Cierre definitivo: <Text fw={600} c="#243e5a">15 de junio 2026</Text>
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Para cambios posteriores, contáctanos directamente.
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="photos">
                                <Accordion.Control>
                                        <Group gap="xs" wrap='nowrap'>
                                        <IconCameraUp size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Hay algún lugar para subir fotos de la boda?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        Usa la sección "Dale Upload a tus Fotos" después del evento.
                                        También puedes ver el álbum en <Button mt="sm"
                                            size="xs"
                                            component="a"
                                            href="https://mega.nz/folder/m9QhFKhAh37UmnjnRLJSAZjH199YWgVer#_album"
                                            target="_blank"
                                            color="red"
                                            leftSection={<IconExternalLink size="12px" />}
                                        >
                                            Mega Album
                                        </Button>
                                    </Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item value="gifts">
                                <Accordion.Control>
                                    <Group gap="xs" wrap='nowrap'>
                                        <IconGift size="1.2rem" color="#243e5a" />
                                        <Text fw={600} size="md">¿Cómo puedo ayudar?</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Text size="sm" c="dimmed">
                                        Tu presencia es el mejor regalo. Pero si deseas ayudarnos monetariamente. Puedes hacerlo a través de: 
                                    </Text>
                                    <Group mt="xs" gap="sm" wrap="wrap" justify='center'>
                                        <Button size="sm" variant="outline" leftSection={<IconHash size="1rem" />}>
                                            Ath Móvil
                                        </Button>
                                        <Button 
                                        size="sm" 
                                        component='a'
                                        href="https://www.paypal.com/paypalme/agabrielrr0"
                                        leftSection={<IconExternalLink size="1rem" />}>
                                            PayPal
                                        </Button>
                                    </Group>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                </motion.section>
            )}

            
        </SimpleGrid>
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
                <div style={{
                    position: 'relative', borderRadius: '12px'
                }}>
                    <img
                        src={selectedImage}
                        alt="Vista completa"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'cover',
                            display: 'block',
                            borderRadius: '12px'

                        }}
                    />
                    <ActionIcon
                        size="lg"
                        radius="xl"
                        variant="filled"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: "#88a9c3",
                            color: '#fff',
                            zIndex: 1000
                        }}
                        onClick={() => setImageModalOpen(false)}
                    >
                        <IconX size="1.5rem" />
                    </ActionIcon>
                </div>
            </Modal>
            <Modal
                opened={adminLoginOpen}
                onClose={() => {
                    setAdminLoginOpen(false);
                    setAdminPasscode('');
                    setAdminError('');
                }}
                title={
                    <Text size="lg" fw={600} c="#243e5a">
                        Panel Administrador
                    </Text>
                }
                centered
                radius="md"
            >
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Entre la contraseña para acceder al panel de administración
                    </Text>

                    <PasswordInput
                        label="Contraseña"
                        placeholder="Entre la contraseña"
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAdminAccess();
                        }}
                    />

                    {adminError && (
                        <Alert color="red" variant="light" title="Acceso denegado">
                            {adminError}
                        </Alert>
                    )}

                    <Group justify="flex-end">
                        <Button
                            variant="default"
                            onClick={() => {
                                setAdminLoginOpen(false);
                                setAdminPasscode('');
                                setAdminError('');
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button className="rsvp-button" onClick={handleAdminAccess}>
                            Acceder panel
                        </Button>
                    </Group>
                </Stack>
            </Modal>

        {/* Admin Modal */}
        <Modal
            opened={adminModalOpen && isAdminAuthenticated}
            onClose={handleAdminClose}
            title={<Text
                    size="lg"
                    fw={600}
                    c="#243e5a"
                    mt='md'
                    style={{ letterSpacing: 0.5 }}
                    >
                        Panel de Administración
                    </Text>}
            size="auto"
            centered
            withinPortal={true}
            zIndex={2000}
            className='modal-text'
            radius='md'
            style={{ color: "#243e5a"}}
        >
            <Stack gap="md">
                    <Card withBorder p="md" style={{ backgroundColor: "#"}}>
                        <Group gap="sm" m='sm' wrap="wrap" justify='center'>
                            <Badge size="sm" color="green" variant="light">Confirmados: {guestList.filter(g => g.isConfirmed).length}</Badge>
                            <Badge size="sm" color="orange" variant="light">Pendientes: {guestList.filter(g => !g.isConfirmed).length}</Badge>
                            <Badge size="sm" color="rgb(237, 51, 51)" variant="light">Declinados: {guestList.filter(g => g.isDeclined).length}</Badge>
                        </Group>
                    <Group justify='space-between' align='flex-start' mt='md'>
                            <Text fw={600} mb="sm" c="#243e5a">Total de invitados: <span style={{ color:"#88a9c3"}}>{guestList.length}</span></Text>
                        {/* <Button className='rsvp-button' size="compact-sm">Añadir invitado <IconCirclePlus size="15" style={{ marginLeft: 4 }} /></Button> */}
                    </Group>
                        {/* <Group wrap="nowrap" className='admin-buttons'> */}
                            {/* todo */}
                            {/* <Button className='excel-button' size="compact-sm" >Exportar excel <IconDownload size={12} /></Button> */}
                        {/* </Group> */}
                </Card>

                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Estado</Table.Th>
                            <Table.Th>Familia</Table.Th>
                            <Table.Th>Mensaje</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {guestList.map((guest) => (
                            <Table.Tr key={guest.id}>
                                <Table.Td>{guest.name}</Table.Td>
                                <Table.Td>
                                    {guest.isConfirmed == true ? (
                                        <Badge color="green" variant="light"><IconCheck size={10} /></Badge>
                                    ) : guest.isDeclined == true ? (
                                        <Badge color="red" variant="light"><IconCancel size={10} /></Badge>
                                    )
                                        : <Badge color="orange" variant="light"><IconClockHour4 size={10} /></Badge>
}
                                </Table.Td>
                                <Table.Td>
                                    {guest.family.length > 0 ? (
                                        <Text size="sm">{guest.family.length}</Text>
                                    ) : (
                                        <Text size="sm" c="dimmed">-</Text>
                                    )}
                                </Table.Td>
                                <Table.Td className='admin-table-col'>
                                    <IconMessage onClick={openDetails} className='admin-table-icon'/>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Stack>
        </Modal>
            <Footer />

        </>
    );
}

export default RSVP;
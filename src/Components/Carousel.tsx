import { useRef } from 'react';
import { Card, Image, Text, Group } from '@mantine/core'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const NextArrow = (props: any) => {
    const { className, style, onClick } = props
    return (
        <button
            type="button"
            className={`${className} timeline-arrow timeline-arrow-next`}
            style={{ ...style }}
            onClick={onClick}
        >
            ›
        </button>
    )
}

const PrevArrow = (props: any) => {
    const { className, style, onClick } = props
    return (
        <button
            type="button"
            className={`${className} timeline-arrow timeline-arrow-prev`}
            style={{ ...style }}
            onClick={onClick}
        >
            ‹
        </button>
    )
}




const historiaCards = [
    {
        id: 1,
        title: 'Agosto 2018 - Nos conocemos en la U',
        description:
            'Durante nuestro primer semestre estudiando en la misma facultad, entre encuentros frecuentes en los pasillos y largas conversaciones, comenzó a nacer nuestra historia.',
        img: '/images/historia1.jpeg'
    },
    {
        id: 2,
        title: 'Enero 2019 - JMJ Panamá',
        description:
            'La peregrinación que cambió nuestras vidas. Fue en esta peregrinación donde nuestros corazones empezaron a encontrarse de una manera diferente.',
        img: '/images/historia1.jpeg'
    },
    {
        id: 3,
        title: 'Febrero 2019 - Noviazgo',
        description:
            'Pocas semanas después de regresar, Ángel le pidió a Mariana que fuera su novia… y ella dijo que sí.',
        img: '/images/historia1.jpeg'
    },
    {
        id: 4,
        title: 'Comienzan las aventuras',
        description:
            'Y empezamos a crear nuevas memorias, llenas de risas y momentos compartidos: salidas, comidas, zip lines y ríos, donde cada plan sencillo se volvía especial simplemente por estar juntos.',
        img: '/images/historia1.jpeg'
    },
    {
        id: 5,
        title: '2023 - Graduación',
        description:
            'Luego de cinco años nos graduamos de la UPRRP, la universidad que vio crecer nuestra relación.',
        img: '/images/historia1.jpeg'
    },
    {
        id: 6,
        title: 'Febrero 2025 - Compromiso',
        description:
            'Después de seis años de noviazgo, llegó el momento más esperado: decidimos dar el próximo paso juntos.',
        img: '/images/historia1.jpeg'
    },
    {
        id: 7,
        title: 'Julio 2025 - JMJ Roma',
        description:
            'Una peregrinación profundamente especial. Mientras comenzábamos los preparativos de la boda y las catequesis prematrimoniales, Dios nos regaló hermosos detalles que confirmaron nuestra vocación al matrimonio.',
        img: '/images/historia1.jpeg'
    }
]

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    variableWidth: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots: React.ReactNode) => (
        <div className="timeline-dots-wrapper">
            <ul> {dots} </ul>
        </div>
    ),
    dotsClass: 'slick-dots timeline-dots',
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                centerMode: false,
                variableWidth: false
            }
        }
    ]
}

export function Carousel() {
    return (
        <section id="nuestra-historia" className="timeline-section">
            <Slider {...settings}>
                {historiaCards.map((card) => (
                    <Card key={card.id} className="timeline-card" radius="md" style={{
                        backgroundImage: `url(${card.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
                        <Image src={card.img} className="timeline-image" />
                        <Group ta="center" align="center" justify="center" gap='xs' mt='xs' mb='xs'>
                            <Text fw={600} ta="center" size="md" c="#243e5a">
                                {card.title}
                            </Text>
                            <Text size="sm" c="dimmed" pl='xs' pr='xs'>
                                {card.description}
                            </Text>
                        </Group>
                    </Card>
                ))}
            </Slider>
        </section>
    )
}

import { Text } from '@mantine/core'
import Slider from 'react-slick'
import { useMemo } from 'react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const fotosDamas = [
    { img: '/images/vestimenta/dama1.png' },
    { img: '/images/vestimenta/dama2.png' },
    { img: '/images/vestimenta/dama3.png' },
    { img: '/images/vestimenta/dama4.png' },
    { img: '/images/vestimenta/dama5.png' },
    { img: '/images/vestimenta/dama6.png' },
    { img: '/images/vestimenta/dama7.png' },
    { img: '/images/vestimenta/dama8.png' },
    { img: '/images/vestimenta/dama9.png' },
    { img: '/images/vestimenta/dama10.png' }
]

const fotosCaballeros = [
    { img: '/images/vestimenta/c1.png' },
    { img: '/images/vestimenta/c2.png' },
    { img: '/images/vestimenta/c3.png' },
    { img: '/images/vestimenta/c4.png' },
    { img: '/images/vestimenta/c5.png' },
    { img: '/images/vestimenta/c6.png' },
    { img: '/images/vestimenta/c7.png' },
    { img: '/images/vestimenta/c8.png' },
    { img: '/images/vestimenta/c9.png' },
    { img: '/images/vestimenta/c10.png' }
]




export function VestimentaCarousel() {

    const settings = useMemo(() => ({
        dots: false,
        infinite: true,
        speed: 5000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        useTransform: true,
        cssEase: "linear",
        adaptiveHeight: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    }), [])


    const settings2 = useMemo(() => ({
        dots: false,
        infinite: true,
        speed: 5000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        useTransform: true,
        cssEase: "linear",
        adaptiveHeight: false,
        rtl: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            }
        ]
    }), [])

    return (
        <section>
            <div>

        <Text ta='center' fw={600} size="xl" c="#243e5a" style={{marginTop: '1rem'}}>Damas</Text>
            <Text ta='center' c='rgb(136, 169, 195)' style={{marginBottom:'1rem', fontStyle: "italic"} }>
                Vestido largo hasta el suelo o los tobillos, vestido de largo medio o un enteriso elegante
            </Text>
            <Slider {...settings}>
                {fotosDamas.map((card, index) => (
                    <div key={index}>
                        <img
                            src={card.img}
                            alt={`Dama ${index + 1}`}
                            style={{ width: '100%', height: '300px', objectFit: 'contain', backgroundColor: "rgb(136, 169, 195)", border: "1px solid #243e5a", borderRadius: "6px" }}
                            />
                    </div>
                ))}
            </Slider>
                </div>
                <div>
                <Text ta='center' fw={600} size="xl" c="#243e5a" style={{marginTop: '1rem'}}>Caballeros</Text>
                <Text ta='center' c='rgb(136, 169, 195)' style={{marginBottom:'1rem', fontStyle: "italic"}}>
                   Traje, camisa, pantalón de vestir y corbata
                </Text>
                <Slider {...settings2}>
                    {fotosCaballeros.map((card, index) => (
                        <div key={index}>
                            <img
                                src={card.img}
                                alt={`Caballero ${index + 1}`}
                                style={{ width: '100%', height: '300px', objectFit: 'contain', backgroundColor: "rgb(136, 169, 195)", border: "1px solid #243e5a", borderRadius: "6px" }}
                            />
                        </div>
                    ))}
                </Slider>
                </div>
        </section>
    )
}

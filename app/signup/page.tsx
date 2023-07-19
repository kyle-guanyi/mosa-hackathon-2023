'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    useToast,
    ScaleFade,
    Container,
    Box,
    SimpleGrid,
    Flex,
    Heading,
    Text,
    Progress,
} from '@chakra-ui/react';
import Lottie from 'lottie-react';

import RegisterEventForm from 'components/registerEventForm';

import strapi, { createHeaders } from '../../utils/request/strapi';
import mentee from 'assets/mentee.json';
import mentor from 'assets/mentor.json';

import type { NextPage, NextPageContext } from 'next';
import type { Certification, Skill } from 'types';
import type { FormikValues } from 'formik';

type Props = {
    headers: { Authorization: string };
    certifications: Certification[];
    skills: Skill[];
};

const RegisterEvent: NextPage<Props> = ({
                                            headers,
                                            certifications,
                                            skills,
                                        }) => {
    const router = useRouter();
    const toast = useToast();

    const [participantType, setParticipantType] = useState<
        'mentor' | 'mentee' | undefined
    >();
    const [progress, setProgress] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (values: FormikValues) => {
        try {
            setIsLoading(true);

            const {
                data: {
                    data: {
                        id,
                        attributes: { uniqueID },
                    },
                },
            } = await strapi.post(
                '/members',
                {
                    data: {
                        ...values,
                        type: participantType,
                        isAvailable: true,
                        emails: [values.email],
                        certifications: values.certifications.map((c: any) => c.value),
                        skills: values.skills.map((s: any) => s.value),
                    },
                },
                { headers }
            );
            router.push({
                pathname: '/event/success',
                query: {
                    participantName: values.firstName,
                    id,
                    uniqueID,
                },
            });
        } catch (error) {
            setIsLoading(false);

            toast({
                title: 'Something went wrong',
                description: 'Please try again',
                position: 'top',
                status: 'error',
                variant: 'subtle',
            });
        }
    };

    return (
        <ScaleFade in initialScale={0.7}>
            <Box
                position='sticky'
                top={0}
                pt={{ base: 7, lg: 20 }}
                bg='white'
                zIndex={1}
            >
                <Container
                    maxW={{ base: '100%', lg: !participantType ? '4xl' : '2xl' }}
                    mb={{ base: 7, lg: 10 }}
                >
                    <Heading fontSize={{ base: 'lg', lg: '3xl' }} fontWeight='600'>
                        {!participantType ? 'Which one are you?' : 'Tell us about yourself'}
                    </Heading>
                    {participantType ? (
                        <Text
                            mt={3}
                            color='blackAlpha.600'
                            fontSize={{ base: 'sm', lg: 'md' }}
                        >
                            We need a few details before we can find you a{' '}
                            {participantType == 'mentor' ? 'mentee' : 'mentor'}
                        </Text>
                    ) : null}
                </Container>
                <Progress
                    isIndeterminate={isLoading}
                    value={progress}
                    size='xs'
                    hasStripe
                    isAnimated
                    colorScheme='palBlue'
                />
            </Box>
            <Container
                maxW={{ base: '100%', lg: !participantType ? '4xl' : '2xl' }}
                py={{ base: 12, lg: 20 }}
            >
                {!participantType ? (
                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                        <Flex
                            as='button'
                            onClick={() => setParticipantType('mentee')}
                            flexDirection='column'
                            justifyContent='space-between'
                            alignItems='center'
                            sx={{
                                position: 'relative',
                                '::before': {
                                    content: '""',
                                    position: 'absolute',
                                    zIndex: -1,
                                    height: '5rem',
                                    width: '5rem',
                                    left: `calc(50% - 2.5rem)`,
                                    top: `calc(50% - 2.5rem)`,
                                    borderRadius: '50%',
                                    bg: 'palBlue.50',
                                    boxShadow: '0 0 6rem 6rem #ffe4ad',
                                    transition: 'all 0.6s',
                                    opacity: 0,
                                    filter: 'blur(10px)',
                                },
                            }}
                            _hover={{
                                '::before': {
                                    boxShadow: '0 0 12rem 12rem #ffe4ad',
                                    opacity: 0.7,
                                },
                            }}
                            _focus={{
                                '::before': {
                                    boxShadow: '0 0 12rem 12rem #ffe4ad',
                                    opacity: 0.7,
                                },
                            }}
                        >
                            <Lottie animationData={mentee} loop />
                            <Text as='span' fontSize='xl' fontWeight={600} mt={6}>
                                Mentee
                            </Text>
                        </Flex>
                        <Flex
                            as='button'
                            onClick={() => setParticipantType('mentor')}
                            flexDirection='column'
                            justifyContent='space-between'
                            alignItems='center'
                            sx={{
                                // borderRadius: '50%',
                                position: 'relative',
                                '::before': {
                                    content: '""',
                                    position: 'absolute',
                                    zIndex: -1,
                                    height: '5rem',
                                    width: '5rem',
                                    left: `calc(50% - 2.5rem)`,
                                    top: `calc(50% - 2.5rem)`,
                                    borderRadius: '50%',
                                    bg: 'palBlue.50',
                                    boxShadow: '0 0 6rem 6rem #c1f7f7',
                                    transition: 'all 0.6s',
                                    opacity: 0,
                                    filter: 'blur(10px)',
                                },
                            }}
                            _hover={{
                                '::before': {
                                    boxShadow: '0 0 12rem 12rem #c1f7f7',
                                    opacity: 0.7,
                                },
                            }}
                            _focus={{
                                '::before': {
                                    boxShadow: '0 0 12rem 12rem #c1f7f7',
                                    opacity: 0.7,
                                },
                            }}
                        >
                            <Box w='90%'>
                                <Lottie animationData={mentor} loop />
                            </Box>
                            <Text as='span' fontSize='xl' fontWeight={600} mt={6}>
                                Mentor
                            </Text>
                        </Flex>
                    </SimpleGrid>
                ) : (
                    <RegisterEventForm
                        participantType={participantType}
                        certifications={certifications}
                        skills={skills}
                        onProgressChange={setProgress}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                )}
            </Container>
        </ScaleFade>
    );
};

export default RegisterEvent;

export const getServerSideProps = async (context: NextPageContext) => {
    const headers = createHeaders(context);
    let certifications = [];
    let skills = [];
    try {
        const {
            data: { data: certificationsResponse },
        } = await strapi.get('/certifications', {
            headers,
        });
        certifications = certificationsResponse;

        const {
            data: { data: skillsResponse },
        } = await strapi.get('/skills', {
            headers,
        });
        skills = skillsResponse;
    } catch (error) {
        console.log(error); // for tracking issues
    }

    return {
        props: { headers, certifications, skills },
    };
};

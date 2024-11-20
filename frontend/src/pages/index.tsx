import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          PC Hardware <br />
          <Text as={'span'} color={'blue.400'}>
            Marketplace
          </Text>
        </Heading>
        <Text color={'gray.500'}>
          Buy and sell PC components, complete builds, and accessories. 
          Join our community of tech enthusiasts!
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}>
          <Button
            colorScheme={'blue'}
            bg={'blue.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'blue.500',
            }}>
            Get Started
          </Button>
          <Button variant={'ghost'} colorScheme={'blue'} size={'sm'}>  {/* Changed from 'link' to 'ghost' */}
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
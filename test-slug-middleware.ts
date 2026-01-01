import prisma from './lib/prisma';

async function testSlugMiddleware() {
  console.log('Testing slug generation middleware...');
  
  try {
    // Create an event with a title
    const event1: any = await prisma.event.create({
      data: {
        title: 'Test Event 1',
        image: 'test-image.jpg',
        date: '2025-12-25',
        time: '10:00',
        mode: 'ONLINE',
        description: 'This is a test event'
      }
    });
    
    console.log('Created event with slug:', event1.slug);
    
    // Create another event with the same title
    const event2: any = await prisma.event.create({
      data: {
        title: 'Test Event 1',
        image: 'test-image2.jpg',
        date: '2025-12-26',
        time: '11:00',
        mode: 'OFFLINE',
        description: 'This is another test event with the same title'
      }
    });
    
    console.log('Created second event with slug:', event2.slug);
    
    // Create an event with special characters in the title
    const event3: any = await prisma.event.create({
      data: {
        title: 'Test Event #2 with $pecial Characters!',
        image: 'test-image3.jpg',
        date: '2025-12-27',
        time: '12:00',
        mode: 'HYBRID',
        description: 'This is a test event with special characters'
      }
    });
    
    console.log('Created event with special characters with slug:', event3.slug);
    
    // Clean up - delete the test events
    await prisma.event.deleteMany({
      where: {
        id: {
          in: [event1.id, event2.id, event3.id]
        }
      }
    });
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSlugMiddleware();

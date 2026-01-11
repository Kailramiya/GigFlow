async function testValidation() {
  console.log('Testing registration validation...\n');

  const testCases = [
    {
      name: 'Invalid email and short password',
      data: { name: 'ab', email: 'invalid-email', password: '123' },
      expectErrors: ['name', 'email', 'password']
    },
    {
      name: 'All valid fields',
      data: { name: 'John Doe', email: 'john@example.com', password: 'password123' },
      expectSuccess: true
    },
    {
      name: 'Missing password',
      data: { name: 'Jane Doe', email: 'jane@example.com' },
      expectErrors: ['password']
    }
  ];

  for (const test of testCases) {
    console.log(`\n📝 Test: ${test.name}`);
    console.log(`Data: ${JSON.stringify(test.data)}`);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(result, null, 2)}`);

      if (test.expectErrors) {
        const hasErrors = test.expectErrors.every(field => result.errors && result.errors[field]);
        console.log(`✅ Has expected errors: ${hasErrors}`);
      }
      if (test.expectSuccess) {
        console.log(`✅ Registration successful: ${result.success}`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

testValidation().catch(console.error);

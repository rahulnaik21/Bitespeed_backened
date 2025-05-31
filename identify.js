
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const identify = async (req, res) => {
  const { email, phoneNumber } = req.body;

  // Basic check
  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber is required" });
  }



  // 1. Find all matching contacts
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ],
    },
    orderBy: { createdAt: "asc" }, // oldest first
  });


  let primaryContact = null;
  let allContacts = [];

  if (existingContacts.length > 0) {
    // 2. Find the true primary contact

    for (let contact of existingContacts) {
      if (contact.linkPrecedence === "primary") {
        primaryContact = contact;
        break;
      }
    }
    
     if (!primaryContact) {
      primaryContact = existingContacts[0]; // fallback
    }

    // 3. Check if new info is present → create secondary
    const foundEmail = existingContacts.some(c => c.email === email);
    const foundPhone = existingContacts.some(c => c.phoneNumber === phoneNumber);

    if (!foundEmail || !foundPhone) {
      // 3.1 Create a new secondary contact
      const newContact = await prisma.contact.create({
        data: {
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        },
      });

      allContacts = [...existingContacts, newContact];
    } else {
      allContacts = existingContacts;
    }
  }

  
  else {
    // 4. No existing → create primary contact

    const newPrimary = await prisma.contact.create({
      data: {
        email: email || null,
        phoneNumber: phoneNumber || null,
        linkPrecedence: "primary",
      },
    });

    primaryContact = newPrimary;
    allContacts = [newPrimary];
  }


  // 5. Organize results

  const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))];

  const secondaryContactIds = allContacts.filter(c => c.linkPrecedence === "secondary").map(c => c.id);

  res.status(200).json({
    contact: {
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...emails.filter(e => e !== primaryContact.email)],
      phoneNumbers: [primaryContact.phoneNumber, ...phoneNumbers.filter(p => p !== primaryContact.phoneNumber)],
      secondaryContactIds,
    },
  });

  // res.status(200).json({ message: "Identify logic will go here" });
};

module.exports = identify;
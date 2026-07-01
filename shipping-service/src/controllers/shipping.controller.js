import prisma from "../prismaClient.js";

export const createShipment = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    const shipment = await prisma.shipment.create({
      data: {
        orderId,
        userId,
        status: "PENDING",
      },
    });

    res.status(201).json(shipment);
  } catch {
    res.status(500).json({ error: "Shipment failed" });
  }
};

export const updateShipment = async (req, res) => {
  const { status } = req.body;

  const shipment = await prisma.shipment.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.json(shipment);
};
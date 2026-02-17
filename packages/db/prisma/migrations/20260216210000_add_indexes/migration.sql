-- CreateIndex
CREATE INDEX "Order_date_idx" ON "Order"("date" DESC);

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Product_orderId_idx" ON "Product"("orderId");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE INDEX "Product_specification_idx" ON "Product"("specification");

-- CreateIndex
CREATE INDEX "Product_date_idx" ON "Product"("date" DESC);

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

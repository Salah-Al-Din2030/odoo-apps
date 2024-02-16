// نفس االسابق لكن باضفة خيار خصم نسبة او ثابت من شااشة الاعادادات
odoo.define("pos_global_discount_in_line.GlobalLineDiscount", function (require) {
    "use strict";

    const DiscountButton = require("pos_discount.DiscountButton");
    const Registries = require("point_of_sale.Registries");

    const GlobalLineDiscount = (DiscountButton) =>
        class extends DiscountButton {
            async onClick() {
                var self = this;
                const { confirmed, payload } = await this.showPopup("NumberPopup", {
                    title: this.env.pos.config.global_fixes_discount_in_line ? this.env._t("Fixed Discount Amount") : this.env._t("Discount Percentage"),
                    startingValue: this.env.pos.config.global_fixes_discount_in_line ? 0 : this.env.pos.config.discount_pc,
                });

                // 1- confirm and apply percentage discount if Fixed dicount is False
                if (confirmed && !this.env.pos.config.global_fixes_discount_in_line) {
                    
                    const pc = parseFloat(payload.replace(",", "."));
                    const subtotal = this.env.pos.get_order().get_total_with_tax();
                    
                    if (this.env.pos.config.global_discount_in_line) {
                        // Display an error message if discount amount exceeds the subtotal
                        if (pc > 100 || pc < 0) {
                            await this.showPopup("ErrorPopup", {
                                title: this.env._t("Invalid Discount percentage"),
                                body: this.env._t("The discount percentage cannot exceed the 100%. or Negative Value."),
                            });
                            return;
                        }
                    }
                    await self.apply_discount(payload.replace(",", "."));
                }

                // 2- confirm and apply fixed discount if Fixed dicount is True
                if (confirmed && this.env.pos.config.global_fixes_discount_in_line) {
                    await self.clear_discount();

                    const order = this.env.pos.get_order();
                    const subtotal = order ? order.get_total_without_tax() : 0;
                    const fixedDiscount = parseFloat(payload.replace(",", "."));


                    if (this.env.pos.config.global_discount_in_line) {
                        // Display an error message or handle the case where the discount amount exceeds the subtotal
                        if (fixedDiscount > subtotal || fixedDiscount < 0) {
                            await this.showPopup("ErrorPopup", {
                                title: this.env._t("Invalid Discount Amount"),
                                body: this.env._t("The discount amount cannot exceed the subtotal. or Negative Value."),
                            });
                        return;
                        }
                        
                    }


                    const discountPercentage = (fixedDiscount / subtotal) * 100;

                    await self.apply_discount(discountPercentage.toFixed(2));
                    await self.recalculate_taxes(); // Recalculate taxes after discount
                }
            }

            async clear_discount() {
                const order = this.env.pos.get_order();
                const lines = order.get_orderlines();
                for (const ind in lines) {
                    lines[ind].discount = 0;
                    lines[ind].discountStr = String("");
                }
                // order.deselect_orderline();
            }

            async apply_discount(pc) {
                if (this.env.pos.config.global_discount_in_line) {
                    const order = this.env.pos.get_order();
                    const lines = order.get_orderlines();
                    for (const ind in lines) {
                        lines[ind].discount = pc;
                        lines[ind].discountStr = String(pc);
                    }
                    order.deselect_orderline();
                } else {
                    super.apply_discount(pc);
                }
            }

            async recalculate_taxes() {
                const order = this.env.pos.get_order();
                const lines = order.get_orderlines();
                const taxes = [];

                for (const line of lines) {
                    const lineTaxes = line.get_taxes();
                    for (const tax of lineTaxes) {
                        if (!taxes.includes(tax)) {
                            taxes.push(tax);
                        }
                    }
                }
            }
        };

    Registries.Component.extend(DiscountButton, GlobalLineDiscount);

    return DiscountButton;
});

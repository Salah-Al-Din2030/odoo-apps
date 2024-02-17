from odoo import fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    global_discount_in_line = fields.Boolean(string="Add Discount in Line" ,default=True)
    global_fixes_discount_in_line = fields.Boolean(string="Fixed amount Discount?" ,default=True)

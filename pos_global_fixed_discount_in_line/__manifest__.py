{
    "name": "Point of Sale - Global Fixed/Percentagein Discount in Line",
    "summary": "Order discount Fixed/Percentagein lines instead of discount product",
    "version": "16.0.1.0.0",
    "category": "Point Of Sale",
    "author": "Salah, Ilyas, Ooops404, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "AGPL-3",
    "depends": [
        "pos_discount",
    ],
    "assets": {
        "point_of_sale.assets": [
            "pos_global_fixed_discount_in_line/static/src/js/GlobalLineDiscount.js",
        ],
    },
    "data": ["views/res_config_settings_views.xml"],
}

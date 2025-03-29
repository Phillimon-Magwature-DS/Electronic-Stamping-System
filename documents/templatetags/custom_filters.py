from django import template

register = template.Library()

@register.filter
def endswith(value, arg):
    """Custom filter to check if a string ends with a specific suffix."""
    return value.endswith(arg)
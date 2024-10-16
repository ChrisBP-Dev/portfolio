// lib/src/common_widgets/custom_text_form_field.dart
import 'package:flutter/material.dart';

class CustomTextFormField extends StatelessWidget {
  const CustomTextFormField({
    required this.labelText,
    super.key,
    this.onSaved,
    this.validator,
    this.keyboardType,
    this.maxLines,
  });

  final String labelText;
  final FormFieldSetter<String>? onSaved;
  final FormFieldValidator<String>? validator;
  final TextInputType? keyboardType;
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return TextFormField(
      autovalidateMode: AutovalidateMode.onUserInteraction,
      cursorErrorColor: theme.dividerColor,
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: theme.textTheme.bodySmall
            ?.copyWith(color: theme.dividerColor.withOpacity(.7)),
        border: defaultBorder(theme.dividerColor),
        enabledBorder: defaultBorder(theme.dividerColor),
        focusedErrorBorder: defaultBorder(theme.dividerColor),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: theme.colorScheme.primary),
        ),
      ),
      onSaved: onSaved,
      validator: validator,
      keyboardType: keyboardType ?? TextInputType.text,
      maxLines: maxLines ?? 1,
      textAlignVertical: TextAlignVertical.top,
    );
  }

  OutlineInputBorder defaultBorder(Color color) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: color),
    );
  }
}

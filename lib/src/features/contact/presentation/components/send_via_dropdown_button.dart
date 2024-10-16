import 'package:flutter/material.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/localization/string_hardcoded.dart';

class SendViaDropDownButton extends StatelessWidget {
  const SendViaDropDownButton({
    required this.value,
    required this.onChanged,
    super.key,
  });
  final SendThrough value;
  final void Function(SendThrough?) onChanged;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    OutlineInputBorder defaultBorder() => OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(
            color: theme.dividerColor,
          ),
        );

    return DropdownButtonFormField<SendThrough>(
      value: value,
      decoration: InputDecoration(
        labelText: 'Send via'.hardcoded,
        labelStyle: theme.textTheme.bodyLarge?.copyWith(
          color: theme.colorScheme.onSurface,
        ),
        border: defaultBorder(),
        enabledBorder: defaultBorder(),
        focusedBorder: defaultBorder(),
      ),
      items: SendThrough.values.map((SendThrough option) {
        return DropdownMenuItem<SendThrough>(
          value: option,
          child: Text(
            option.name,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface,
            ),
          ),
        );
      }).toList(),
      onChanged: onChanged,
      dropdownColor: theme.scaffoldBackgroundColor,
      iconEnabledColor: theme.colorScheme.onSurface,
      iconDisabledColor: theme.disabledColor,
      elevation: 5,
    );
  }
}

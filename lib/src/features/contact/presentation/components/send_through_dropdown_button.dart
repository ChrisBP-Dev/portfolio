import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/localization/l10n.dart';

class SendThroughDropDownButton extends StatelessWidget {
  const SendThroughDropDownButton({
    required this.value,
    required this.onChanged,
    super.key,
  });
  final SendThrough value;
  final void Function(SendThrough?) onChanged;
  @override
  Widget build(BuildContext context) {
    OutlineInputBorder defaultBorder() => OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(
            color: context.theme.dividerColor,
          ),
        );

    final l10n = context.l10n;

    return DropdownButtonFormField<SendThrough>(
      value: value,
      decoration: InputDecoration(
        labelText: l10n.sendThrough,
        labelStyle: context.bodyLarge?.copyWith(
          color: context.theme.colorScheme.onSurface,
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
            style: context.bodyLarge?.copyWith(
              color: context.theme.colorScheme.onSurface,
            ),
          ),
        );
      }).toList(),
      onChanged: onChanged,
      dropdownColor: context.theme.scaffoldBackgroundColor,
      iconEnabledColor: context.theme.colorScheme.onSurface,
      iconDisabledColor: context.theme.disabledColor,
      elevation: 5,
    );
  }
}
